const BattleMessageController = require('../controllers/BattleMessageController');
const knex = require('../knex');

module.exports = new BattleMessageController(
  {
    battleMessageTable: 'BattleMessage',
    userTable: 'User'
  },
  knex
);
