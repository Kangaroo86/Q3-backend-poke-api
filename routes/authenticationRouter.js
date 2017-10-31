const express = require('express');
const Boom = require('boom');
const router = express.Router();

const authenticationController = require('./authenticationController');

router.post('/authenticate', authenticationController.authenticate);
router.all('/authenticate', (request, response, next) => {
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'POST']));
});

module.exports = router;
