const Yup = require('yup');
const ValidationError = require('yup/lib/ValidationError');

const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class Validator {
  constructor({ name, schemas, logError }) {
    this._name = name;
    this._schemas = schemas;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async validate(input, schemaName = 'default') {
    try {
      const schema = this._schemas[schemaName];
      if (!schema) throw this._createSchemaNotFoundError();
      return await Yup.object(schema).validate(input, {
        abortEarly: false,
        stripUnknown: true
      });
    } catch (error) {
      this._logError(error);
      if (error instanceof ValidationError) {
        const validationErrors = error.inner.reduce(
          (validationErrors, pathError) =>
            Object.assign({}, validationErrors, {
              [pathError.path]: pathError.type
            }),
          {}
        );
        throw this._createInvalidInputError(validationErrors);
      }
      throw this._createUnexpectedError();
    }
  }

  _createSchemaNotFoundError() {
    return new Error(`${this._name || ''}${Validator.ERROR_SCHEMA_NOT_FOUND}`);
  }

  _createInvalidInputError(validationErrors) {
    const error = new Error(
      `${this._name || ''}${Validator.ERROR_INVALID_INPUT}`
    );
    error.validationErrors = validationErrors;
    return error;
  }

  _createUnexpectedError() {
    return new Error(`${this._name || ''}${Validator.ERROR_UNEXPECTED}`);
  }
}

Validator.ERROR_UNEXPECTED = 'Validator.ERROR_UNEXPECTED';
Validator.ERROR_SCHEMA_NOT_FOUND = 'Validator.ERROR_SCHEMA_NOT_FOUND';
Validator.ERROR_INVALID_INPUT = 'Validator.ERROR_INVALID_INPUT';

module.exports = Validator;
