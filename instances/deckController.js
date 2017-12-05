const DeckController = require('../controllers/DeckController');
const knex = require('../knex');

module.exports = new DeckController(
  {
    deckTable: 'Deck',
    characterTable: 'Character',
    cardTable: 'Card',
    userTable: 'User'
  },
  knex
);
