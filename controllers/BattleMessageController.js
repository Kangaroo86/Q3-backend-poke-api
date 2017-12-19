//**********SUMMART**********//

class BattleMessageController {
  constructor({ battleMessageTable, userTable }, knex) {
    this._knex = knex;
    this._battleMessage = battleMessageTable;
    this._user = userTable;
    this._bindMethods(['createMessage']);
  }

  //************CREATE MESSAGE*********//
  createMessage(request, response, next) {
    const userId = request.body.userId;
    const battleId = request.body.battleId;
    let text = request.body.text;

    this._knex.transaction(trx => {
      return this._knex(this._battleMessage)
        .transacting(trx)
        .insert({ battleId: battleId, userId: userId, text: text });
    });
  }

  //************GET MESSAGE*********//
  getMessage(request, response, next) {
    const battleId = request.params.battleId;

    this._knex(this._battleMessage)
      .select('text')
      .where('battleId', battleId)
      .then(arryOfText => {
        response.json(arryOfText);
      });
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = BattleMessageController;
