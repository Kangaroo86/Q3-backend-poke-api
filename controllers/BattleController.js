//**********SUMMART**********//

class BattleController {
  constructor({ battleTable, userTable }, knex) {
    this._knex = knex;
    this._battle = battleTable;
    this._user = userTable;
    this._bindMethods([
      'createBattle',
      'deleteBattleState',
      'getBattleState',
      'requestBattle',
      'setBattleState'
    ]);
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

  deleteBattleState(request, response, next) {
    const id = Number(request.params.battleId);
    this._knex(this._battle).where('id', id).del().then(result => {
      response.json(result);
    });
  }

  getBattleState(request, response, next) {
    const id = Number(request.params.battleId);

    this._knex(this._battle)
      .select('state')
      .where('id', id)
      .first()
      .then(state => {
        //console.log('what is my state------', state);
        response.json(state.state);
      });
  }

  setBattleState(request, response, next) {
    //console.log('got inside of setBattleState 1');
    const battleId = Number(request.body.battleId);
    const stateObj = request.body.stateObj;

    //console.log('stateObj---------', stateObj);

    this._knex(this._battle)
      .where('id', battleId)
      .update({ state: stateObj }, '*')
      .then(battleObj => {
        response.json(battleObj);
      });
  }

  //************CREATE BATTLE*********//
  createBattle(request, response, next) {
    const jwtUserId = request.jwt ? request.jwt.payload.sub : null;

    this._knex(this._battle) //check pending battle
      .select('id')
      .whereNotIn('userOneId', [jwtUserId])
      .whereIn('status', ['pending'])
      .first()
      .then(record => {
        record
          ? this._knex(this._battle) //find pending battle
              .where('id', record.id)
              .update({ status: 'progress', userTwoId: jwtUserId }, '*')
              .then(() => {
                response.json({ playerNum: 2, battleId: record.id }); //created battle, now send data to F/E
              })
          : this._knex(this._battle) //if not, create new battle and add user
              .whereNotIn('userOneId', [jwtUserId])
              .insert({ status: 'pending', userOneId: jwtUserId })
              .returning('id')
              .then(battleId => {
                response.json({ playerNum: 1, battleId: battleId[0] });
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
