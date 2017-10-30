const AuthenticationService = require('../services/AuthenticationService');

const { DEBUG, JWT_KEY } = require('../../env');

module.exports = new AuthenticationService({
  authenticationValidator: require('./authenticationValidator'),
  jwtSecretKey: JWT_KEY,
  userRepository: require('./userRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
