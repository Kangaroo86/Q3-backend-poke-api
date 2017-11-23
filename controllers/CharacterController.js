//**********SUMMART**********//
//To get default pokemon from Character Table

class CharacterController {
  constructor({ characterTable }, knex) {
    this._knex = knex;
    this._character = characterTable;
    this._bindMethods(['getAllCharacters']);
  }

  //**********Get All Character********//
  getAllCharacters(request, response, next) {
    this._knex(this._character)
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
