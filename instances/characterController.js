const CharacterController = require('../controllers/CharacterController');
const knex = require('../knex');

module.exports = new CharacterController(
  {
    characterTable: 'Character'
  },
  knex
);
