const BattleController = require('../controllers/BattleController');
const knex = require('../knex');

module.exports = new BattleController(
  {
    battleTable: 'Battle'
  },
  knex
);
