const express = require('express');
const Boom = require('boom');
const router = express.Router();

const userController = require('./userController');

//.all => it requires that all routes from that point on require authentication, and automatically load a user.
router.post('/user', userController.create);
router.get('/user', userController.getAll);
router.all('/user', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
);

router.get('/user/:id(\\d+)', userController.getById);
router.patch('/user/:id(\\d+)', userController.update);
// router.delete('/user/:id(\\d+)', userController.delete);
router.all('/user/:id(\\d+)', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
);

module.exports = router;
