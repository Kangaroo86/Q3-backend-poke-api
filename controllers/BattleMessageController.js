//**********SUMMART**********//
//NONE WERE USED IN PRODUCTION

class BattleMessageController {
  constructor({ battleMessageTable, userTable }, knex) {
    this._knex = knex;
    this._battleMessage = battleMessageTable;
    this._user = userTable;
    this._bindMethods(['getAllMessages']);
  }

  //************CREATE MESSAGE*********//
  // createMessage(request, response, next) {
  //   const userId = request.body.userId;
  //   const battleId = request.body.battleId;
  //   let text = request.body.text;
  //
  //   this._knex.transaction(trx => {
  //     return this._knex(this._battleMessage)
  //       .transacting(trx)
  //       .insert({ battleId: battleId, userId: userId, text: text });
  //   });
  // }

  //make api call on FE
  //************GET MESSAGE*********//
  getAllMessages(request, response, next) {
    const battleId = request.params.battleId;

    this._knex(this._battleMessage)
      .select('text', 'userId', 'name')
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
