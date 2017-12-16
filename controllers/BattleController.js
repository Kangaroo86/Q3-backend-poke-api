//**********SUMMART**********//

class BattleController {
  constructor({ battleTable, userTable }, knex) {
    this._knex = knex;
    this._battle = battleTable;
    this._user = userTable;
    this._bindMethods(['requestBattle', 'createBattle']);
  }

  //************REQUEST BATTLE*********//
  //Might not user this
  //find a room for battle that have vacant seat
  requestBattle(request, response, next) {
    const userId = request.body.userTwoId;

    this._knex(this._battle)
      .select('id')
      .where('status', 'pending')
      .first() //select the first column
      .then(record => {
        if (!record) {
          //if no room, create newRoom
          return this.createBattle(request, response, next);
        }
        return this._knex.transaction(trx => {
          return this._knex(this._battle)
            .where('id', record.id) //
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
    const userId = request.body.userOneId;

    // FIRST! check if there is a pending battle.
    // if so, add current user to that battleId
    // SQL: ELECT * FROM Battle WHERE userOneId != userId AND status = 'pending' LIMIT 1
    // ===> let's say this return 62, then update that record to assign user to it
    // SQL: UPDATE Battle SET userTwoId = userId WHERE battle-id = 62;

    this._knex(this._battle) //check pending battle
      .select('*')
      .whereNotIn('userOneId', [userId])
      .whereIn('status', ['pending'])
      .first()
      .then(record => {
        record
          ? this._knex.transaction(trx => {
              this._knex(this._battle)
                .where('id', record.id)
                .transacting(trx)
                .update({ userTwoId: userId, status: 'progress' }, '*')
                .then(battleObj => {
                  response.json(battleObj);
                });
            })
          : this._knex(this._battle) //if not, create new battle and add user
              .insert({ status: 'pending', userOneId: userId })
              .then(battleObj => {
                response.json(battleObj);
              });
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
