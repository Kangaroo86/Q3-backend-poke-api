const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/decks', (request, response, next) => {
  //knex('Deck');
  knex
    .from('Deck')
    .innerJoin('Card', 'Deck.id', 'Card.deckId')
    .innerJoin('Character', 'Card.characterId', 'Character.id')
    .returning('*')
    // .first()
    //.orderBy('name', 'asc')
    .then(deck => {
      console.log('this is deck----', deck);
      let hardcodeName = 'HardCoded';
      let newObj = {
        deckId: '',
        deckName: '',
        wins: '',
        losses: '',
        pokeObj: []
      };
      deck.forEach(data => {
        (newObj.deckId =
          data.id), (newObj.deckName = hardcodeName), (newObj.wins = data.wins);
      });
      console.log('this is result----', newObj);
      response.json(deck);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/decks/:id(\\d+)', (request, response, next) => {
  let someId = parseInt(request.params.id);
  if (someId < 0 || someId > 100 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('Deck')
      .where('id', request.params.id)
      .first()
      .then(deck => {
        if (!deck) {
          return next();
        }
        response.json(deck);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post('/decks', (request, response, next) => {
  let attributes = {
    name: request.body.name,
    losses: request.body.losses,
    wins: request.body.wins,
    userId: request.body.userId
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
    knex('Deck')
      .insert(attributes, '*')
      .then(deck => {
        response.json(deck);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.delete('/decks/:id(\\d+)', (request, response, next) => {
  let deck;
  let someId = parseInt(request.params.id);
  if (someId > 100 || someId < 0 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('Deck')
      .where('id', request.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }
        deck = row;
        return knex('Deck').del().where('id', request.params.id);
      })
      .then(() => {
        delete deck.id;
        response.json();
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
