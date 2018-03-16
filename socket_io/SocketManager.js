const knex = require('../knex');

module.exports = io => {
  io.on('connection', function(socket) {
    console.log('Socket id :::::::::::::::::::::::: ' + socket.id);

    socket.on('RECONNECT_ROOM', battleId => {
      if (battleId) {
        socket.join(battleId);
        updateMessage(battleId);
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

    /*SET_BATTLE_STATE*/
    socket.on('STATE_UPDATED', stateObj => {
      setBattleState(stateObj);
    });

    //TODO not compatible with socket io yet
    function setBattleState(stateObj) {
      console.log('setBattleState--------------', stateObj);
      knex('Battle')
        .where('id', stateObj.battle_id)
        .update({ state: stateObj }, '*')
        .then(obj => {
          console.log('obj---------', obj);
          io
            .in(obj[0].state.battle_id)
            .emit('UPDATED_BATTLE_STATE', obj[0].state);
        });
    }

    //***VERIFY USERNAME***//
    // socket.on(VERIFY_USER, (name, userId, battleId) => {
    //   //goes on the HOME Page
    //   let user = {};
    //   if (userId === 'null') {
    //     user = createUser({ name: name });
    //     socket.emit(USER_CREATED, user);
    //     connectedUsers = addUser(connectedUsers, user);
    //   } else {
    //     user.id = userId;
    //     user.name = name;
    //   }
    //   socket.user = user;
    //   //socket.join(socket.room);
    //
    //   if (battleId !== 'null') {
    //     getMessage(battleId);
    //   }
    //
    //   io.emit(USER_CONNECTED, connectedUsers);
    // });
  });
};
