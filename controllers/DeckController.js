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
      'deleteDeck'
    ]);
  }

  //***********************************//
  //************Get All Decks**********//
  //***********************************//
  getAllDeck(request, response, next) {
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
      })
      .catch(err => {
        next(err);
      });
  }

  //***********************************//
  //************Get Deck By Id*********//
  //***********************************//
  getDeckById(request, response, next) {
    const userId = request.jwt ? request.jwt.payload.sub : null;
    let paramsId = Number(request.params.id);

    if (paramsId < 0 || paramsId > 100 || isNaN(paramsId) === true) {
      response.set('Content-Type', 'text/plain').status(404).send('Not Found');
      return;
    }

    if (userId !== paramsId) {
      response.sendStatus(405);
      return;
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
      })
      .catch(err => {
        next(err);
      });
  }

  //***********************************//
  //*************Create Deck***********//
  //***********************************//
  //you can't test this in a terminal, whereas front-end will succee//
  createDeck(request, response, next) {
    const userId = request.jwt ? request.jwt.payload.sub : null;
    //let paramsId = Number(request.params.id);

    //console.log('userId------', userId);
    //console.log('paramsId------', paramsId); //null why?
    //console.log('does this equal', paramsId === userId); //false cause paramsId is null

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
            if (err.message === 'HTTP_400 deckName is blank') {
              response
                .set('Content-Type', 'text/plain')
                .status(400)
                .send('Deck name must not be blank');
            } else {
              next(err);
            }
          });
      });
    }
  }

  //***********************************//
  //*************Delete Deck***********//
  //***********************************//
  deleteDeck(request, response, next) {
    const userId = request.jwt ? request.jwt.payload.sub : null;
    let deck;
    let someId = parseInt(request.params.id);

    console.log('userId---------', userId);
    console.log('someId---------', someId);
    console.log('request ++++++++++', request);

    if (someId > 100 || someId < 0 || isNaN(someId) === true) {
      throw new Error('HTTP_404');
    } else {
      this._knex(this._deck)
        .where({ userId })
        .where('id', request.params.id)
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
        })
        .catch(err => {
          if (err.message === 'HTTP_404') {
            response
              .set('Content-Type', 'text/plain')
              .status(404)
              .send('Not Found');
            return;
          }
          next(err);
        });
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
