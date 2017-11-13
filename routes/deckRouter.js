const express = require('express');
const router = express.Router();
const knex = require('../knex');

/**This just get all user's deck**/
router.get('/decks/', (request, response, next) => {
  //const userId = request.jwt ? request.jwt.payload.sub : null;
  //let paramsId = Number(request.params.id);
  const scope = {};
  knex('Deck')
    //.where({ userId })
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

/**NOTES :id is NOT the deck's id. It is the user's id. Refactor in the future???**/
router.get('/decks/:id(\\d+)', (request, response, next) => {
  const userId = request.jwt ? request.jwt.payload.sub : null;
  let paramsId = Number(request.params.id);

  if (paramsId < 0 || paramsId > 100 || isNaN(paramsId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else if (userId === paramsId) {
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
      });
  }
});

//you can't test this in a terminal, whereas front-end will succee
router.post('/decks', (request, response, next) => {
  const userId = request.jwt ? request.jwt.payload.sub : null;
  //let paramsId = Number(request.params.id);

  //console.log('userId------', userId);
  //console.log('paramsId------', paramsId); //null why?
  //console.log('does this equal', paramsId === userId); //false cause paramsId is null

  if (!request.body.deckName) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('deck name must not be blank');
  } else {
    const scope = {};
    return knex.transaction(trx => {
      return knex('Deck')
        .where({ userId })
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
          return knex('Character')
            .transacting(trx)
            .whereIn('pokemonId', pokemonIds);
        })
        .then(characters => {
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
//router.get('/users/:id(\\d+)/decks', (request, response, next) => {
// give :id in URL
// you can run SELECT * FROM Deck WHERE userId = :id
//});
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
