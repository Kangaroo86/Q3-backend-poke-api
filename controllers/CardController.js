//**********SUMMART**********//
//Card table contains all of deckId and characterId associated with it.
//Function below are not used in production
//CardController > cardController > cardRouter

class CardController {
  constructor({ cardTable }, knex) {
    this._knex = knex;
    this._card = knex(cardTable);
    this._bindMethods(['getAllCards', 'createCard', 'deleteCard']);
  }

  //************Get All Cards**********//
  getAllCards(request, response, next) {
    this._knex(this._card)
      .select('*')
      .then(card => {
        response.json(card);
      })
      .catch(err => next(err));
  }

  //************Create Cards**********//
  createCard(request, response, next) {
    let attributes = {
      deckId: request.body.deckId,
      characterId: request.body.characterId
    };
    this._knex(this._card)
      .insert(attributes, '*')
      .then(card => {
        response.json(card);
      })
      .catch(err => next(err));
  }

  //************Delete Decks***********//
  deleteCard(request, response, next) {
    let card;
    let someId = parseInt(request.params.id);
    if (someId > 100 || someId < 0 || isNaN(someId) === true) {
      throw new Error('HTTP_404');
    } else {
      this._knex(this._card)
        .where('id', request.params.id)
        .first()
        .then(row => {
          if (!row) {
            return next();
          }
          card = row;
          return this._knex(this._card).del().where('id', request.params.id);
        })
        .then(() => {
          delete card.id;
          response.json;
        })
        .catch(err => {
          if (err.message === 'HTTP_404') {
            response
              .set('Content-Type', 'text/plain')
              .status(404)
              .send('Not Found');
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

module.exports = CardController;
