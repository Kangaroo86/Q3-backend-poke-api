const UserController = require('../controllers/UserController');

module.exports = new UserController({
  userTable: 'User'
});
