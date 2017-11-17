const EntityController = require('../controllers/EntityController');
const knex = require('../knex');

module.exports = new EntityController(
  {
    userTable: 'User'
  },
  knex
);
