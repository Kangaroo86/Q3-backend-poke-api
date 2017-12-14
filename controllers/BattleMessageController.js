//**********SUMMART**********//

class BattleMessageController {
  constructor({ battleMessageTable, userTable }, knex) {
    this._knex = knex;
    this._battle = battleMessageTable;
    this._user = userTable;
    this._bindMethods(['getBattleMessage']);
  }

  //************Get Deck By Id*********//
  getBattleMessage(request, response, next) {
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

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = BattleMessageController;
