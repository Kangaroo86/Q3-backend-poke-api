/**
 * A generalized repository class with CRUD operations, intended to be
 * used with Knex
 *
 * @author Nestor Toro <nestor@axiomlogic.com>
 *
 * @license
 * © 2014,2017 Nestor Toro
 *
 * END-USER LICENSE AGREEMENT (EULA)
 *
 * In order to use this software, you (the "end-user") must agree to and accept
 * the following terms: (1) the end-user must request permission from, or be
 * granted permission by, the author to use this software, (2) the end-user must
 * not remove this license from the source file(s), (3) the end-user may not
 * copy any part of the source code to other source file(s), (4) the end-user
 * acknowledges the software is provided as-is and the author provides no
 * warranties and cannot be held liable for improper use or defects of the
 * software, (5) the end-user agrees not to use the software for commercial use
 * without prior consent from the author, (6) the end-user agrees not to publish
 * the sofware's source code in a public forum without prior consent from the
 * author, (6) the end-user agrees not to make changes to the software without
 * prior consent from the author.
 */

const Boom = require('boom');

const { pluralize } = require('../utils/StringUtils');

class EntityController {
  constructor({ entityName, entityService }) {
    this._entityName = entityName;
    this._entityService = entityService;
    this._bindMethods(['create', 'getAll', 'getById', 'update', 'delete']);
  }

  async create(request, response, next) {
    try {
      const entity = await this._entityService.create(request.body, {
        userId: request.authenticatedUserId
      });
      response
        .status(201)
        .set(
          'Location',
          `/${pluralize(this._entityName.toLowerCase())}/${entity.id}`
        )
        .json(entity);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  async getAll(request, response, next) {
    try {
      const entities = await this._entityService.getAll({
        userId: request.authenticatedUserId
      });
      response.json(entities);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  async getById(request, response, next) {
    try {
      const id = parseInt(request.params.id);
      const entity = await this._entityService.getById(id, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  async update(request, response, next) {
    try {
      const id = parseInt(request.params.id);
      const entity = await this._entityService.update(id, request.body, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  async delete(request, response, next) {
    try {
      const id = parseInt(request.params.id);
      const entity = await this._entityService.delete(id, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }

  _convertError(error) {
    if (error.message.endsWith('Service.ERROR_INVALID_INPUT')) {
      return Boom.badRequest(error.message);
    }
    if (error.message.endsWith('Service.ERROR_PERMISSION_DENIED')) {
      return Boom.forbidden(error.message);
    }
    if (error.message.endsWith('Service.ERROR_NOT_FOUND')) {
      return Boom.notFound(error.message);
    }
    if (error.message.endsWith('Service.ERROR_UNEXPECTED')) {
      return Boom.badImplementation(error.message);
    }
    return Boom.badImplementation();
  }
}

module.exports = EntityController;
