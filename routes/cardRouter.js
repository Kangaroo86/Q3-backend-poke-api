const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/cards', (request, response, next) => {
  knex('Card')
    .select('*')
    .then(card => {
      response.json(card);
    })
    .catch(err => next(err));
});

router.post('/cards', (request, response, next) => {
  let attributes = {
    deckId: request.body.deckId,
    characterId: request.body.characterId
  };
  knex('Card')
    .insert(attributes, '*')
    .then(card => {
      response.json(card);
    })
    .catch(err => next(err));
});

router.delete('/cards/:id(\\d+)', (request, response, next) => {
  let card;
  let someId = parseInt(request.params.id);
  if (someId > 100 || someId < 0 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('Card')
      .where('id', request.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }
        card = row;
        return knex('Card').del().where('id', request.params.id);
      })
      .then(() => {
        delete card.id;
        response.json;
      })
      .catch(err => next(err));
  }
});

module.exports = router;
