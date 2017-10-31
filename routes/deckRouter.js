const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

router.get('/deck', (request, response, next) => {
  knex('deck')
    .orderBy('name', 'asc')
    .then(deck => {
      response.json(humps.camelizeKeys(deck));
    })
    .catch(err => {
      next(err);
    });
});

router.get('/deck/:id(\\d+)', (request, response, next) => {
  let someId = parseInt(request.params.id);
  if (someId < 0 || someId > 100 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('deck')
      .where('id', request.params.id)
      .first()
      .then(deck => {
        if (!deck) {
          return next();
        }
        response.json(humps.camelizeKeys(deck));
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post('/deck', (request, response, next) => {
  let attributes = {
    name: request.body.name,
    losses: request.body.losses,
    wins: request.body.wins
  };
  if (!request.body.name) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('Title must not be blank');
  } else if (!request.body.losses) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('Author must not be blank');
  } else if (!request.body.wins) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('Genre name must not be blank');
  } else {
    knex('deck')
      .insert(attributes, '*')
      .then(deck => {
        response.json(humps.camelizeKeys(deck[0]));
      })
      .catch(err => {
        next(err);
      });
  }
});

router.delete('/deck/:id(\\d+)', (request, response, next) => {
  let deck;
  let someId = parseInt(request.params.id);
  if (someId > 100 || someId < 0 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('deck')
      .where('id', request.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }
        deck = row;
        return knex('deck').del().where('id', request.params.id);
      })
      .then(() => {
        delete deck.id;
        response.json(humps.camelizeKeys(deck));
      })
      .catch(err => {
        next(err);
      });
  }
});

// router.post('/deck', deckController.create);
// router.all('/deck', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
// );
//
// router.get('/user/:id(\\d+)/deck', deckController.findByDeckId);
// router.all('/user/:id(\\d+)/deck', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET']))
// );
//
// router.get('/user/:id(\\d+)/deck', deckController.getById);
// router.delete('/deck/:id(\\d+)', deckController.delete);
// router.put('/deck/:id(\\d+)', deckController.update);
// router.all('/deck/:id(\\d+)', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PUT', 'DELETE']))
// );

module.exports = router;
