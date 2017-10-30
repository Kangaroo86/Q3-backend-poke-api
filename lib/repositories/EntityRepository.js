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

const { omit } = require('../utils/ObjectUtils');
const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class EntityRepository {
  constructor({ entityName, db, logError }) {
    this._entityName = entityName;
    this._db = db;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async create(attributes) {
    try {
      const [record] = await this._db(this._entityName)
        .insert(attributes)
        .returning('*');
      return omit(record, isFunction);
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async getAll() {
    try {
      const records = await this._db(this._entityName);
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async getById(id) {
    try {
      const [record] = await this._db(this._entityName).where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async getByIds(ids) {
    try {
      const records = await this._db(this._entityName).whereIn('id', ids);
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async findByAttribute(attributeName, attributeValue) {
    try {
      const records = await this._db(this._entityName).where(
        attributeName,
        attributeValue
      );
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async update(id, attributes) {
    try {
      const [record] = await this._db(this._entityName)
        .update(attributes)
        .returning('*')
        .where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  async delete(id) {
    try {
      const [record] = await this._db(this._entityName)
        .delete()
        .returning('*')
        .where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }

  _createUnexpectedError() {
    throw new Error(
      EntityRepository.ERROR_UNEXPECTED.replace('Entity', this._entityName)
    );
  }
}

EntityRepository.ERROR_UNEXPECTED = 'EntityRepository.ERROR_UNEXPECTED';

module.exports = EntityRepository;
