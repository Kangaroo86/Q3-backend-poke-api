const express = require('express');
const router = express.Router();
const knex = require('../knex');
//const humps = require('humps');

router.get('/character', (request, response, next) => {
  knex('character')
    .orderBy('pokemonId', 'asc')
    .then(character => {
      character.json(character);
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
