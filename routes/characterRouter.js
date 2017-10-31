const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/characters', (request, response, next) => {
  knex('Character')
    .orderBy('id', 'asc')
    .then(allCharacter => {
      response.json(allCharacter);
    })
    .catch(err => next(err));
});

module.exports = router;
// const express = require('express');
// const Boom = require('boom');
// const router = express.Router();
//
// const characterController = require('./characterController');
//
// router.get('/character', characterController.getAll);
// router.all('/character', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTION', 'GET']))
// );
