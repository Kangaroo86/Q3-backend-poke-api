const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/decks', (request, response, next) => {
  const scope = {};
  knex('Deck')
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
  let someId = parseInt(request.params.id);
  if (someId < 0 || someId > 100 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    const scope = {};
    knex('Deck')
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

router.post('/decks', (request, response, next) => {
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
