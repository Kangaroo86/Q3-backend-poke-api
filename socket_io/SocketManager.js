const knex = require('../knex');

module.exports = io => {
  io.on('connection', function(socket) {
    console.log('Socket id :::::::::::::::::::::::: ' + socket.id);

    socket.on('RECONNECT_ROOM', battleId => {
      if (battleId) {
        socket.join(battleId);
        updateMessage(battleId);
        updateBattleState(battleId);
      }
    });

    /*CREATE_ROOM*/
    socket.on('CREATE_ROOM', battleId => {
      console.log('ROOM ID was created :::::::::::::::::::::::: ', battleId);
      socket.join(battleId);
    });

    /*SEND_MESSAGES*/
    socket.on('CREATE_MESSAGE', messageObj => {
      let { userId, battleId, text, name } = messageObj;
      createMessage(userId, battleId, text, name);
    });

    /*KNEX_CREATE_MESSAGE*/
    function createMessage(userId, battleId, message, name) {
      knex('BattleMessage')
        .insert({
          userId: userId,
          battleId: battleId,
          text: message,
          name: name
        })
        .then(() => updateMessage(battleId))
        .catch(err => err);
    }

    /*KNEX_UPDATE_MESSAGE*/
    function updateMessage(battleId) {
      knex('BattleMessage')
        .where('battleId', battleId)
        .select('*')
        .then(messages => {
          io.in(battleId).emit('MESSAGE_RESPONSE', messages);
        });
    }

    function updateBattleState(battleId) {
      knex('Battle').where('id', battleId).select('*').then(obj => {
        console.log('what is updated state--------------', obj[0].state);
        io.in(battleId).emit('UPDATED_BATTLE_STATE', obj[0].state);
      });
    }

    /*SET_BATTLE_STATE*/
    socket.on('STATE_UPDATED', stateObj => {
      setBattleState(stateObj);
    });

    function setBattleState(stateObj) {
      knex('Battle')
        .where('id', stateObj.battle_id)
        .update({ state: stateObj }, '*')
        .then(obj => {
          io
            .in(obj[0].state.battle_id)
            .emit('UPDATED_BATTLE_STATE', obj[0].state);
        });
    }
  });
};
