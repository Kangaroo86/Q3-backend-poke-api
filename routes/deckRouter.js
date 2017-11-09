const express = require('express');
const router = express.Router();
const knex = require('../knex');
const { JWT_KEY } = require('../env');
const jwt = require('jsonwebtoken');

router.get('/decks/', (request, response, next) => {
  console.log('This is request ----------', request);
  console.log('This is request headers----------', request.headers);
  console.log('This is request jwt----------', request.jwt);
  const userId = request.jwt ? request.jwt.payload.sub : null;

  //console.log('what is this request:::--------', request);
  //console.log('what is this request.jwt--------', userId);
  // TODO: if no userID (i.e. === null), then return emptry array;

  const scope = {};
  knex('Deck')
    .where({ userId })
    .then(decks => {
      scope.decks = decks;
      const promises = decks.map(deck =>
        knex('Character').whereIn(
          'id',
          knex('Card').select('characterId').where({ deckId: deck.id })
        )
      );
      return Promise.all(promises);
    })
    .then(results => {
      const { decks } = scope;
      decks.forEach((deck, i) => {
        deck.cards = results[i];
      });
      response.json(decks);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/decks/:id(\\d+)', (request, response, next) => {
  const userId = request.jwt ? request.jwt.payload.sub : null;
  console.log(
    'This is request ----------',
    userId === Number(request.params.id)
  );
  console.log('This is request params ----------', request.params.id);

  //const jwtVerify = jwt.verify();

  let paramsId = Number(request.params.id);
  if (paramsId < 0 || paramsId > 100 || isNaN(paramsId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    const scope = {};
    knex('Deck')
      .where({ userId })
      .then(decks => {
        scope.decks = decks;
        const promises = decks.map(deck =>
          knex('Character').whereIn(
            'id',
            knex('Card').select('characterId').where({ deckId: deck.id })
          )
        );
        return Promise.all(promises);
      })
      .then(results => {
        const { decks } = scope;
        decks.forEach((deck, i) => {
          deck.cards = results[i];
        });
        let data = decks.filter(result => {
          return result.id === Number(request.params.id);
        });
        response.json(data);
      });
  }
});

//you can't test this in a terminal, whereas front-end will succee
router.post('/decks', (request, response, next) => {
  const userId = request.jwt ? request.jwt.payload.sub : null;
  if (!request.body.deckName) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('deck name must not be blank');
  } else {
    const scope = {};
    return knex.transaction(trx => {
      return knex('Deck')
        .transacting(trx)
        .insert(
          {
            deckname: request.body.deckName,
            userId: request.body.userId
          },
          '*'
        )
        .then(([deck]) => {
          scope.deck = deck;
          const pokemonIds = request.body.pokemonIds;
          //console.log('**** pokemonIds', pokemonIds);
          return knex('Character')
            .transacting(trx)
            .whereIn('pokemonId', pokemonIds);
        })
        .then(characters => {
          //console.log('characters ----', characters);
          return knex('Card').transacting(trx).insert(
            characters.map(character => ({
              deckId: scope.deck.id,
              characterId: character.id
            })),
            '*'
          );
        })
        .then(cards => {
          trx.commit();
          //console.log(cards);
          const { deck } = scope;
          deck.cards = cards;
          response.json(deck);
          return;
        })
        .catch(err => {
          trx.rollback();
          next(err);
        });
    });
  }
});

router.delete('/decks/:id(\\d+)', (request, response, next) => {
  const userId = request.jwt ? request.jwt.payload.sub : null;
  //console.log('request.jwt----------', userId);
  let deck;
  let someId = parseInt(request.params.id);
  if (someId > 100 || someId < 0 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('Deck')
      .where({ userId })
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
