class CardController {
  constructor({ cardTable }, knex) {
    this._knex = knex;
    this._card = knex(cardTable);
    this._bindMethods(['getAllCards', 'createCard', 'deleteCard']);
  }

  //***********************************//
  //************Get All Cards**********//
  //***********************************//
  getAllCards(request, response, next) {
    this._knex(this._card)
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
    this._knex(this._card)
      .insert(attributes, '*')
      .then(card => {
        response.json(card);
      })
      .catch(err => next(err));
  }

  //***********************************//
  //************Delete Decks***********//
  //***********************************//
  // deleteCard(request, response, next) {
  //   let card;
  //   let someId = parseInt(request.params.id);
  //   console.log('this is ID--------', someId);
  //   if (someId > 100 || someId < 0 || isNaN(someId) === true) {
  //     response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  //   } else {
  //     this._knex(this._card)
  //       .where('id', request.params.id)
  //       .first()
  //       .then(row => {
  //         if (!row) {
  //           return next();
  //         }
  //         card = row;
  //         return this._knex(this._card).del().where('id', request.params.id);
  //       })
  //       .then(() => {
  //         delete card.id;
  //         response.json;
  //       })
  //       .catch(err => next(err));
  //   }
  // }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = CardController;
