//**********SUMMART**********//
//CRUD operations for Deck table. Manage all of the user's decks
//Used deck Table, character Table, and card Table

class DeckController {
  constructor({ deckTable, characterTable, cardTable, userTable }, knex) {
    this._knex = knex;
    this._deck = deckTable;
    this._character = characterTable;
    this._card = cardTable;
    this._user = userTable;
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
      this._knex(this._deck).select('*').then(results => {
        response.json(results);
      });
    } catch (err) {
      next(err);
    }
  }

  //************Get Deck By Id*********//
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

      this._knex(this._deck).where({ userId }).then(decks => {
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
      const jwtUserId = request.jwt ? request.jwt.payload.sub : null;
      const deckName = request.body.deckName;
      const wins = request.body.wins;
      const losses = request.body.losses;
      const cardsStr = request.body.pokemonIds.join();
      const userid = request.body.userId;

      this._knex(this._user).where('id', userid).then(userId => {
        if (userId[0].id !== jwtUserId) {
          throw new Error('HTTP_401 unauthorized access');
        } else if (request.body.deckName === '') {
          throw new Error('HTTP_400 deckName could not be blank');
        } else {
          return this._knex(this._deck)
            .where({ userid })
            .insert(
              {
                deckname: deckName,
                wins: wins,
                losses: losses,
                userId: userid,
                cards: cardsStr
              },
              '*'
            )
            .then(cards => {
              response.json(cards);
            })
            .catch(err => {
              throw err;
            });
        }
      });
    } catch (err) {
      if (err.message === 'HTTP_400 deckName could not be blank') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('HTTP_400 deckName could not be blank');
      } else if (err.message === 'HTTP_401 unauthorized access') {
        response
          .set('Content-Type', 'text/plain')
          .status(401)
          .send('HTTP_401 unauthorized access');
      } else {
        next(err);
      }
    }
  }

  //*************Update Deck***********//
  updateDeck(request, response, next) {
    try {
      const jwtUserId = request.jwt ? request.jwt.payload.sub : null;
      const paramDeckId = Number(request.params.deckid);
      const cardsStr = request.body.characterIdArray.join();
      const userid = Number(request.body.userId);

      this._knex(this._deck).where('userId', userid).then(deckObj => {
        if (deckObj[0].userId !== jwtUserId) {
          throw new Error('HTTP_401 unauthorized access');
        } else if (paramDeckId < 0 || isNaN(paramDeckId) === true) {
          throw new Error('HTTP_405 param id is either less than zero or NaN');
        } else {
          return this._knex(this._deck)
            .select('*')
            .where('id', paramDeckId)
            .then(result => {
              return this._knex.transaction(trx => {
                return this._knex(this._deck)
                  .where('id', paramDeckId)
                  .transacting(trx)
                  .update({ cards: cardsStr }, '*') //notes:update only take in string
                  .then(() => {
                    //reason using two tables is b/c you want to pull the lates update
                    this._knex(this._deck)
                      .where('userId', userid)
                      .then(decks => {
                        response.json(decks);
                      });
                  });
              });
            });
        }
      });
    } catch (err) {
      if (err) {
        return err;
      } else if (
        err.message === 'HTTP_405 param id is either less than zero or NaN'
      ) {
        response
          .set('Content-Type', 'text/plain')
          .status(404)
          .send('HTTP_405 param id is either less than zero or NaN');
        return;
      }
      next();
    }
  }

  //*************Delete Deck***********//
  deleteDeck(request, response, next) {
    try {
      const jwtUserId = request.jwt ? request.jwt.payload.sub : null;
      let paramDeckId = parseInt(request.params.deckid);
      this._knex(this._deck)
        //.select('userId')
        .where('userId', jwtUserId)
        .then(result => {
          if (jwtUserId !== result[0].userId) {
            throw new Error('HTTP_401 unauthorized access');
          } else {
            this._knex(this._deck)
              .del()
              .where('id', paramDeckId)
              .then(result => {
                response.json(result);
              });
          }
        });
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
