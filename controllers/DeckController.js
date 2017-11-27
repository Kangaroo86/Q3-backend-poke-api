//**********SUMMART**********//
//CRUD operations for Deck table. Manage all of the user's decks

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
  getAllDeck(request, response, next) {
    try {
      const scope = {};
      this._knex(this._deck)
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
      next(err);
    }
  }

  //************Get Deck By Id*********//
  /**NOTES :id is NOT the deck's id. It is the user's id. Refactor in the future???**/
  getDeckById(request, response, next) {
    try {
      const userId = request.jwt ? request.jwt.payload.sub : null;
      let paramsId = Number(request.params.id);

      if (paramsId < 0 || paramsId > 100 || isNaN(paramsId) === true) {
        throw new Error('HTTP_405 Not Found');
      }

      if (userId !== paramsId) {
        throw new Error('HTTP_405 Not Found');
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
      if (err.message === 'HTTP_405 Not Found') {
        response
          .set('Content-Type', 'text/plain')
          .status(405)
          .send('ParamId and UserId does not match');
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
        throw new Error('HTTP_400 deckName is blank');
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
              // if (err.message === 'HTTP_400 deckName is blank') {
              //   response
              //     .set('Content-Type', 'text/plain')
              //     .status(400)
              //     .send('Deck name must not be blank');
              // } else {
              //   next(err);
              // }
              throw err;
            });
        });
      }
    } catch (err) {
      if (err.message === 'HTTP_400 deckName is blank') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Deck name must not be blank');
      } else {
        next(err);
      }
    }
  }

  //*************Update Deck***********//
  updateDeck(request, response, next) {
    console.log('hellllllllo there');
    try {
      //const userId = request.jwt ? request.jwt.payload.sub : null;
      const paramId = Number(request.params.id);
      if (paramId < 0 || paramId > 100 || isNaN(paramId) === true) {
        throw new Error('HTTP_5000000 POWERRANGER');
      }

      return this._knex(this._card).del().where('deckId', paramId).then(() => {
        request.body.pokemonIds.forEach(pokemonId => {
          return this._knex.transaction(trx => {
            return this._knex(this._card)
              .where('deckId', paramId)
              .transacting(trx)
              .insert(
                {
                  deckId: paramId,
                  characterId: pokemonId
                },
                '*'
              );
          });
        });
      });
    } catch (err) {
      if (err.message === 'HTTP_5000000 POWERRANGER') {
        response
          .set('Content-Type', 'text/plain')
          .status(404)
          .send('Deck Not found POKEMON');
        return;
      }
      next();
    }
    // .update({ characterId: request.body.characterId }, '*')
    // .where('deckId', paramId)
    // .then(result => {
    //   let updated = Object.assign({}, result[0]);
    //   response.json(updated);
    //   return;
    // })
  }

  //*************Delete Deck***********//
  deleteDeck(request, response, next) {
    try {
      const userId = request.jwt ? request.jwt.payload.sub : null;
      let deck;
      let paramId = parseInt(request.params.id);

      if (userId !== paramId) {
        throw new Error('HTTP_405 Not Found');
      }

      if (paramId > 100 || paramId < 0 || isNaN(paramId) === true) {
        throw new Error('HTTP_405 Not Found');
      } else {
        this._knex(this._deck)
          .where({ userId })
          //.where('id', request.params.id)
          .first()
          .then(row => {
            if (!row) {
              return next();
            }
            deck = row;
            return this._knex(this._deck).del().where('id', request.params.id);
          })
          .then(() => {
            delete deck.id;
            response.json();
          });
      }
    } catch (err) {
      if (err.message === 'HTTP_405 Not Found') {
        response
          .set('Content-Type', 'text/plain')
          .status(404)
          .send('ParamId or UserId does not match');
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
