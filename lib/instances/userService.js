const UserService = require('../services/UserService');

const { DEBUG } = require('../../env');

module.exports = new UserService({
  userValidator: require('./userValidator'),
  userRepository: require('./userRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
