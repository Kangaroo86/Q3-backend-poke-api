const knex = require('../knex');

class CardController {
  constructor({ cardTable }) {
    this._card = knex(cardTable);
    this._bindMethods(['getAllCards', 'createCard']);
  }

  getAllCards(request, response, next) {
    this._card
      .select('*')
      .then(card => {
        response.json(card);
      })
      .catch(err => next(err));
  }

  createCard(request, response, next) {
    let attributes = {
      deckId: request.body.deckId,
      characterId: request.body.characterId
    };
    this._card
      .insert(attributes, '*')
      .then(card => {
        response.json(card);
      })
      .catch(err => next(err));
  }

  deleteCard(request, response, next) {
    let card;
    let someId = parseInt(request.params.id);
    if (someId > 100 || someId < 0 || isNaN(someId) === true) {
      response.set('Content-Type', 'text/plain').status(404).send('Not Found');
    } else {
      this._card
        .where('id', request.params.id)
        .first()
        .then(row => {
          if (!row) {
            return next();
          }
          card = row;
          return knex('Card').del().where('id', request.params.id);
        })
        .then(() => {
          delete card.id;
          response.json;
        })
        .catch(err => next(err));
    }
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = CardController;
