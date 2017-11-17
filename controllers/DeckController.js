const knex = require('../knex');

class DeckController {
  constructor({ deckTable, characterTable, cardTable }, knex) {
    this._knex = knex;
    this._deck = deckTable;
    this._character = characterTable;
    this._card = cardTable;
    this._bindMethods(['getAllDeck', 'getDeckById']);
  }

  getAllDeck(request, response, next) {
    const scope = {};
    this._knex(this._deck)
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
  }

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

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = DeckController;
