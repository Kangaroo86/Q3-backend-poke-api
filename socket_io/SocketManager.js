const knex = require('../knex');

module.exports = io => {
  io.on('connection', function(socket) {
    console.log('Socket id :::::::::::::::: ' + socket.id);

    //***INFORM_PLAYER_TO_UPDATE***// //NOTE not used in production
    // socket.on('STATE_UPDATED', () => {
    //   var foo = setInterval(() => {
    //     socket.emit('REFRESH_STATE');
    //     console.log('waiting for refresh...');
    //   }, 3000);
    //   socket.on('REFRESH_DONE', () => {
    //     console.log('refresh done!!!');
    //     clearInterval(foo);
    //   });
    // });

    //***SET_BATTLE_STATE***// //TODO WIP
    socket.on('STATE_UPDATED', stateObj => {
      setBattleState(stateObj);
    });

    //***CREATE_ROOM***//
    socket.on('CREATE_ROOM', roomBattleId => {
      console.log('Room_Id was created*************', roomBattleId);
      socket.join(roomBattleId);
    });

    //***SEND_MESSAGES***//
    socket.on('CREATE_MESSAGE', messageObj => {
      let { userId, battleId, text, name } = messageObj;

      createMessage(userId, battleId, text, name);

      //setInterval(updateMessage(battleId), 1000); //HACK turn to promiese later
      //updateMessage(battleId); //TODO causing one delay when receiving messages
      //io.in(battleId).emit('MESSAGE_RESPONSE', messageObj);
    });

    //***KNEX_CREATE_MESSAGE***//
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

    //NOTE fixed chat
    function updateMessage(battleId) {
      knex('BattleMessage')
        .where('battleId', battleId)
        .select('*')
        .then(messages => {
          io.in(battleId).emit('MESSAGE_RESPONSE', messages);
        });
    }

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
