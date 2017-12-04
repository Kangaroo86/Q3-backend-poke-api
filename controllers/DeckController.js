//**********SUMMART**********//
//CRUD operations for Deck table. Manage all of the user's decks
//Used deck Table, character Table, and card Table

class DeckController {
  constructor({ deckTable, characterTable, cardTable }, knex) {
    this._knex = knex;
    this._deck = deckTable;
    this._character = characterTable;
    this._card = cardTable;
    this._bindMethods([
      'getAllDeck',
      'getDeckById',
      'createDeck',
      'deleteDeck',
      'updateDeck'
    ]);
  }

  // ************Get All Decks**********//
  //Not used in production
  getAllDeck(request, response, next) {
    try {
      const scope = {};
      this._knex(this._deck)
        .then(decks => {
          scope.decks = decks;
          const promises = decks.map(deck =>
            this._knex(this._character).whereIn(
              //SELECT "characterId" FROM "Card" WHERE "deckId" IN (1,2,3,4,5)
              'id',
              this._knex(this._card) //SELECT "characterId" FROM "Card" WHERE "deckId" = 1
                .select('characterId')
                .where({ deckId: deck.id })
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
    } catch (err) {
      next(err);
    }
  }

  //************Get Deck By Id*********//
  /**NOTES :id is NOT the deck's id. It is the user's id. Refactor in the future???**/
  //change to /users/7/decks

  ///users/7/decks

  getDeckById(request, response, next) {
    try {
      const userId = request.jwt ? request.jwt.payload.sub : null;
      let paramsId = Number(request.params.id);

      if (paramsId < 0 || isNaN(paramsId) === true) {
        throw new Error('HTTP_405 param id is either less than zero or NaN');
      }

      if (userId !== paramsId) {
        throw new Error('HTTP_405 userId does not match to paramId');
      }

      const scope = {};

      this._knex(this._deck)
        .where({ userId })
        .then(decks => {
          scope.decks = decks;
          const promises = decks.map(deck =>
            this._knex(this._character).whereIn(
              'id',
              this._knex(this._card)
                .select('characterId')
                .where({ deckId: deck.id })
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
    } catch (err) {
      if (err.message === 'HTTP_405 param id is either less than zero or NaN') {
        response
          .set('Content-Type', 'text/plain')
          .status(405)
          .send('HTTP_405 param id is either less than zero or NaN');
      } else if (err.message === 'HTTP_405 userId does not match to paramId') {
        response
          .set('Content-Type', 'text/plain')
          .status(405)
          .send('HTTP_405 userId does not match to paramId');
      } else {
        next(err);
      }
    }
  }

  //*************Create Deck***********//
  //you can't test this in a terminal, whereas front-end will succee//
  createDeck(request, response, next) {
    try {
      const userId = request.jwt ? request.jwt.payload.sub : null;

      if (!request.body.deckName) {
        throw new Error('HTTP_400 deckName could not be blank');
      } else {
        const scope = {};
        return this._knex.transaction(trx => {
          return this._knex(this._deck)
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
              return this._knex(this._character)
                .transacting(trx)
                .whereIn('pokemonId', pokemonIds);
            })
            .then(characters => {
              return this._knex(this._card).transacting(trx).insert(
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
              throw err;
            });
        });
      }
    } catch (err) {
      if (err.message === 'HTTP_400 deckName could not be blank') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('HTTP_400 deckName could not be blank');
      } else {
        next(err);
      }
    }
  }

  //*************Update Deck***********//
  updateDeck(request, response, next) {
    try {
      const jwtUserId = request.jwt ? request.jwt.payload.sub : null;
      const paramUserId = Number(request.params.id);
      const paramDeckId = Number(request.params.deckid);

      if (paramDeckId < 0 || isNaN(paramDeckId) === true) {
        throw new Error('HTTP_405 param id is either less than zero or NaN');
      } else if (jwtUserId !== paramUserId) {
        throw new Error('HTTP_401 unauthorized access');
      }

      return this._knex(this._card)
        .del()
        .where('deckId', paramDeckId)
        .then(() => {
          request.body.characterIdArray.forEach(pokemonId => {
            return this._knex.transaction(trx => {
              return this._knex(this._card)
                .where('deckId', paramDeckId)
                .transacting(trx)
                .insert(
                  {
                    deckId: paramDeckId,
                    characterId: pokemonId
                  },
                  '*'
                );
            });
          });
        });
    } catch (err) {
      if (err.message === 'HTTP_405 param id is either less than zero or NaN') {
        response
          .set('Content-Type', 'text/plain')
          .status(404)
          .send('HTTP_405 param id is either less than zero or NaN');
        return;
      }
      next();
    }
  }

  // updateDeck(request, response, next) {
  //   try {
  //     //const userId = request.jwt ? request.jwt.payload.sub : null;
  //     const paramId = Number(request.params.id);
  //     if (paramId < 0 || paramId > 100 || isNaN(paramId) === true) {
  //       throw new Error('HTTP_5000000 POWERRANGER');
  //     }
  //     console.log('what is my body------', request.body);
  //
  //     this._knex(this._card)
  //       .where('deckId', paramId)
  //       .update({ characterId: request.body.characterIdArray[0] }, '*') //how do you pass this as an array
  //       .then(results => {
  //         console.log('my results----', results);
  //         //let updates = results;
  //         let output = Object.assign({}, results[0]); //why are we making a copy
  //         response.json(output);
  //       })
  //       .catch(err => {
  //         console.log('my current err', err);
  //       });
  //   } catch (err) {
  //     console.log('my err--', err);
  //
  //     next();
  //   }
  // }

  //*************Delete Deck***********//
  deleteDeck(request, response, next) {
    try {
      const jwtUserId = request.jwt ? request.jwt.payload.sub : null;

      let paramUserId = parseInt(request.params.id);
      let paramDeckId = parseInt(request.params.deckid);

      if (paramUserId < 0 || isNaN(paramUserId) === true) {
        throw new Error('HTTP_405 param id is either less than zero or NaN');
      } else if (paramDeckId < 0 || isNaN(paramDeckId) === true) {
        throw new Error('HTTP_405 param id is either less than zero or NaN');
      } else if (jwtUserId !== paramUserId) {
        throw new Error('HTTP_401 unauthorized access');
      } else {
        this._knex(this._deck).del().where('id', paramDeckId).then(() => {
          response.json();
        });
      }
    } catch (err) {
      if (err.message === 'HTTP_405 param id is either less than zero or NaN') {
        response
          .set('Content-Type', 'text/plain')
          .status(404)
          .send('HTTP_405 param id is either less than zero or NaN');
        return;
      } else if (err.message === 'HTTP_401 unauthorized access') {
        response
          .set('Content-Type', 'text/plain')
          .status(401)
          .send('HTTP_401 unauthorized access');
        return;
      }
      next(err);
    }
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = DeckController;
