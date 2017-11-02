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
