const knex = require('../knex');

class CharacterController {
  constructor({ characterTable }) {
    this._character = knex(characterTable);
    this._bindMethods(['getAllCharacters']);
  }

  //***********************************//
  //**********Get All Character********//
  //***********************************//
  getAllCharacters(request, response, next) {
    this._character
      .orderBy('id', 'asc')
      .then(allCharacter => {
        response.json(allCharacter);
      })
      .catch(err => next(err));
  }
  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = CharacterController;
