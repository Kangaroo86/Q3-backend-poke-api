const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');
const { pick, omit } = require('../utils/ObjectUtils');

class DeckService {
  constructor({ deckValidator, deckRepository, userRepository, logError }) {
    this._deckValidator = deckValidator;
    this._deckRepository = deckRepository;
    this._userRepository = userRepository;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async create(attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      attributes = await this._deckValidator.validate(attributes, 'forCreate');
      attributes.userId = authenticatedUser.id;
      return await this._deckRepository.create(attributes);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
        throw this._createInvalidInputError();
      }
      throw this._createUnexpectedError();
    }
  }

  async getAll() {
    try {
      const articles = await this._articleRepository.getAll();
      const authorIds = articles.reduce(
        (authorIds, article) =>
          authorIds.includes(article.authorId)
            ? authorIds
            : [...authorIds, article.authorId],
        []
      );
      const authors = await this._userRepository.getByIds(authorIds);
      const authorsById = authors.reduce(
        (authorsById, author) =>
          Object.assign({}, authorsById, { [author.id]: author }),
        {}
      );
      articles.forEach(article => {
        article.author = pick(authorsById[article.authorId], [
          'id',
          'name',
          'username'
        ]);
      });
      return articles;
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async findByAuthorId(authorId) {
    try {
      const articles = await this._articleRepository.findByAttribute(
        'authorId',
        authorId
      );
      return articles.map(article => omit(article, 'authorId'));
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async getById(id) {
    try {
      const article = await this._articleRepository.getById(id);
      article.author = await this._userRepository.getById(article.authorId);
      return article;
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async update(id, attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      const article = await this._articleRepository.getById(id);
      if (!article) throw this._createNotFoundError();
      if (authenticatedUser.id !== article.authorId) {
        throw this._createPermissionDeniedError();
      }
      attributes = await this._articleValidator.validate(
        attributes,
        'forUpdate'
      );
      attributes.timeModified = new Date().toISOString();
      return await this._articleRepository.update(id, attributes);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
        throw this._createInvalidInputError();
      }
      throw this._createUnexpectedError();
    }
  }

  async delete(id, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      const article = await this._articleRepository.getById(id);
      if (!article) throw this._createNotFoundError();
      if (
        authenticatedUser.role !== 'ROLE_ADMIN' &&
        authenticatedUser.id !== article.authorId
      ) {
        throw this._createPermissionDeniedError();
      }
      return await this._articleRepository.delete(id);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DeckService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  async _getAuthenticatedUser(authentication) {
    const { userId: authenticatedUserId } = authentication;
    if (!Number.isFinite(authenticatedUserId)) return null;
    return await this._userRepository.getUserById(authenticatedUserId);
  }

  _createUnexpectedError() {
    return new Error(DeckService.ERROR_UNEXPECTED);
  }

  _createPermissionDeniedError() {
    return new Error(DeckService.ERROR_PERMISSION_DENIED);
  }

  _createInvalidInputError() {
    return new Error(DeckService.ERROR_INVALID_INPUT);
  }

  _createNotFoundError() {
    return new Error(DeckService.ERROR_NOT_FOUND);
  }
}

DeckService.ERROR_UNEXPECTED = 'DeckService.ERROR_UNEXPECTED';
DeckService.ERROR_NOT_FOUND = 'DeckService.ERROR_NOT_FOUND';
DeckService.ERROR_PERMISSION_DENIED = 'DeckService.ERROR_PERMISSION_DENIED';
DeckService.ERROR_INVALID_INPUT = 'DeckService.ERROR_INVALID_INPUT';

module.exports = DeckService;
