const { promisify } = require('util');
const JwtUtils = require('jsonwebtoken');
const signJwt = promisify(JwtUtils.sign);
const bcrypt = require('bcryptjs');

const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class AuthenticationService {
  constructor({
    authenticationValidator,
    jwtSecretKey,
    userRepository,
    logError
  }) {
    this._authenticationValidator = authenticationValidator;
    this._userRepository = userRepository;
    this._jwtSecretKey = jwtSecretKey;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async authenticate(credentials) {
    try {
      credentials = Object.assign({}, credentials);
      if (!credentials.email || !credentials.password) {
        this._logError('No email or password! Credentials: ', credentials);
        throw this._createInvalidInputError();
      }
      credentials = await this._authenticationValidator.validate(credentials);
      const [user] = await this._userRepository.findByAttribute(
        'email',
        credentials.email
      );
      console.log('authenticate(): credentials.email: ', credentials.email); // eslint-disable-line no-console
      if (!user) {
        this._logError('authenticate(): No user found'); // eslint-disable-line no-console
        throw this._createInvalidCredentialsError();
      }
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        user.hashedPassword
      );
      if (!isValidPassword) {
        this._logError('authenticate(): Invalid password'); // eslint-disable-line no-console
        throw this._createInvalidCredentialsError();
      }
      const timeIssued = Math.floor(Date.now() / 1000);
      const timeExpires = timeIssued + 86400 * 14; // 14 days
      return signJwt(
        {
          iss: 'bloglet',
          aud: 'bloglet',
          iat: timeIssued,
          exp: timeExpires,
          sub: user.id
        },
        this._jwtSecretKey
      );
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(AuthenticationService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  _createUnexpectedError() {
    return new Error(AuthenticationService.ERROR_UNEXPECTED);
  }

  _createInvalidInputError() {
    return new Error(AuthenticationService.ERROR_INVALID_INPUT);
  }

  _createInvalidCredentialsError() {
    return new Error(AuthenticationService.ERROR_CREDENTIALS_INVALID);
  }
}

AuthenticationService.ERROR_UNEXPECTED =
  'AuthenticationService.ERROR_UNEXPECTED';
AuthenticationService.ERROR_INVALID_INPUT =
  'AuthenticationService.ERROR_INVALID_INPUT';
AuthenticationService.ERROR_CREDENTIALS_INVALID =
  'AuthenticationService.ERROR_CREDENTIALS_INVALID';

module.exports = AuthenticationService;
