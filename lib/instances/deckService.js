const DeckService = require('../services/DeckService');

const { DEBUG } = require('../../env');

module.exports = new DeckService({
  deckValidator: require('./deckValidator'),
  deckRepository: require('./deckRepository'),
  userRepository: require('./userRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
