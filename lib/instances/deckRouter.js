const express = require('express');
const Boom = require('boom');
const router = express.Router();

const deckController = require('./deckController');

router.post('/deck', deckController.create);
router.get('/deck', deckController.getAll);
router.all('/deck', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
);

router.get('/user/:id(\\d+)/deck', deckController.findByDeckId);
router.all('/user/:id(\\d+)/deck', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET']))
);

router.get('/user/:id(\\d+)/deck', deckController.getById);
router.delete('/deck/:id(\\d+)', deckController.delete);
router.put('/deck/:id(\\d+)', deckController.update);
router.all('/deck/:id(\\d+)', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PUT', 'DELETE']))
);

module.exports = router;
