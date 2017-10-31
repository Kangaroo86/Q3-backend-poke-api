const express = require('express');
const Boom = require('boom');
const router = express.Router();

const characterController = require('./characterController');

router.get('/character', characterController.getAll);
router.all('/character', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTION', 'GET']))
);
