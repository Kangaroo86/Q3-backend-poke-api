const AuthenticationController = require('../controllers/AuthenticationController');

module.exports = new AuthenticationController({
  authenticationService: require('./authenticationService')
});
