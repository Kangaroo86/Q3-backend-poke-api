const EntityController = require('../controllers/EntityController');

module.exports = new EntityController({
  entityName: 'User',
  entityService: require('./userService')
});
