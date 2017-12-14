//**********SUMMART**********//

class BattleController {
  constructor({ battleTable, userTable }, knex) {
    this._knex = knex;
    this._battle = battleTable;
    this._user = userTable;
    this._bindMethods(['requestBattle', 'createBattle']);
  }

  //************REQUEST BATTLE*********//
  //find a room for battle that have vacant seat
  requestBattle(request, response, next) {
    const userId = request.body.userId;

    this._knex(this._battle)
      .select('status')
      .where('status', 'pending')
      .first() //select the first column
      .then(record => {
        return this._knex.transaction(trx => {
          return this._knex(this._battle)
            .where('id', record.id)
            .transacting(trx)
            .update({ userTwoId: userId, status: 'progress' }, '*')
            .then(battleObj => {
              response.json(battleObj);
            });
        });
      });
  }

  //************CREATE BATTLE*********//
  createBattle(request, response, next) {
    const userId = request.body.userId;

    this._knex(this._battle)
      .insert({ status: 'pending', userOneId: userId })
      .then(battleObj => {
        response.json(battleObj);
      });
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = BattleController;
