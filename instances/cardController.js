const CardController = require('../controllers/CardController');
const knex = require('../knex');

module.exports = new CardController(
  {
    cardTable: 'Card'
  },
  knex
);
