const DeckController = require('../controllers/DeckController');

module.exports = new DeckController({
  deckService: require('./deckService'),
  userService: require('./userService')
});
