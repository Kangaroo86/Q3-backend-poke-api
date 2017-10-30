const bcrypt = require('bcryptjs');

const { omit, pick } = require('../utils/ObjectUtils');
const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class UserService {
  constructor({ userValidator, userRepository, logError }) {
    this._userValidator = userValidator;
    this._userRepository = userRepository;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async create(attributes, authentication) {
    try {
      attributes = Object.assign({}, attributes);
      attributes = await this._userValidator.validate(attributes, 'forCreate');
      const hashedPassword = await bcrypt.hash(attributes.password, 10);
      delete attributes.password;
      attributes.hashedPassword = hashedPassword;
      const user = await this._userRepository.create(attributes);
      return omit(user, 'hashedPassword');
    } catch (error) {
      this._logError(error);
      if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
        throw this._createInvalidInputError();
      }
      throw this._createUnexpectedError();
    }
  }

  async getAll(authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      if (authenticatedUser.role !== 'ROLE_ADMIN') return [authenticatedUser];
      const users = await this._userRepository.getAll();
      return users.map(user => omit(user, 'hashedPassword'));
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(UserService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async getById(id, authentication) {
    this._logError(
      'UserService.getById: id=',
      id,
      'authentication=',
      authentication
    );
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      const user = await this._userRepository.getById(id);
      if (!user) throw this._createNotFoundError();
      /* If user is authenticated, and is asking for his own user ID, return all fields
      except password.
      Otherwise, only return id, email, and name.
      */
      if (
        authenticatedUser &&
        (authenticatedUser.role === 'ROLE_ADMIN' || authenticatedUser.id === id)
      ) {
        return omit(user, 'hashedPassword');
      }
      return pick(user, ['id', 'name', 'email']);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(UserService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async update(id, attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      if (
        authenticatedUser.id !== id &&
        authenticatedUser.role !== 'ROLE_ADMIN'
      ) {
        throw this._createPermissionDeniedError();
      }
      attributes = await this._userValidator.validate(attributes, 'forUpdate');
      attributes.timeModified = new Date().toISOString();
      const user = await this._userRepository.update(id, attributes);
      if (!user) throw this._createNotFoundError();
      return omit(user, 'hashedPassword');
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(UserService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async delete(id, authentication) {
    this._logError(
      'UserService.delete: id=',
      id,
      'authentication=',
      authentication
    );
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) {
        this._logError('UserService.delete(): No authenticatedUser');
        throw this._createPermissionDeniedError();
      }
      if (
        authenticatedUser.role !== 'ROLE_ADMIN' ||
        authenticatedUser.id === id // NOTE: Admins cannot delete themselves
      ) {
        this._logError('UserService.delete(): Admin failed');
        throw this._createPermissionDeniedError();
      }
      const user = await this._userRepository.delete(id);
      if (!user) throw this._createNotFoundError();
      return omit(user, 'hashedPassword');
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(UserService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async _getAuthenticatedUser(authentication) {
    const { userId: authenticatedUserId } = authentication;
    if (!Number.isFinite(authenticatedUserId)) return null;
    const authenticatedUser = await this._userRepository.getById(
      authenticatedUserId
    );
    return omit(authenticatedUser, 'hashedPassword');
  }

  _createUnexpectedError() {
    return new Error(UserService.ERROR_UNEXPECTED);
  }

  _createPermissionDeniedError() {
    return new Error(UserService.ERROR_PERMISSION_DENIED);
  }

  _createInvalidInputError() {
    return new Error(UserService.ERROR_INVALID_INPUT);
  }

  _createNotFoundError() {
    return new Error(UserService.ERROR_NOT_FOUND);
  }
}

UserService.ERROR_UNEXPECTED = 'UserService.ERROR_UNEXPECTED';
UserService.ERROR_NOT_FOUND = 'UserService.ERROR_NOT_FOUND';
UserService.ERROR_PERMISSION_DENIED = 'UserService.ERROR_PERMISSION_DENIED';
UserService.ERROR_INVALID_INPUT = 'UserService.ERROR_INVALID_INPUT';

module.exports = UserService;
