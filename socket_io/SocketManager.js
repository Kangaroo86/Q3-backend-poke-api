const knex = require('../knex');

module.exports = io => {
  io.on('connection', function(socket) {
    console.log('Socket Id ********************' + socket.id);

    //***SEND_SOCKET_ID***// //NOTE not used in production
    socket.on('CHAT_MOUNTED', user => {
      socket.emit('RECEIVE_SOCKET', socket.id);
    });

    //***INFORM_PLAYER_TO_UPDATE***// //NOTE not used in production
    socket.on('STATE_UPDATED', () => {
      var foo = setInterval(() => {
        socket.emit('REFRESH_STATE');
        console.log('waiting for refresh...');
      }, 3000);
      socket.on('REFRESH_DONE', () => {
        console.log('refresh done!!!');
        clearInterval(foo);
      });
    });

    //***CREATE_ROOM***//
    socket.on('CREATE_ROOM', roomBattleId => {
      console.log('roomBattleId-------', roomBattleId);
      socket.join(roomBattleId);
    });

    //***SEND_MESSAGES***//
    socket.on('CREATE_MESSAGE', messageObj => {
      let { userId, battleId, text, name } = messageObj;
      console.log('messageObj-------', messageObj);

      createMessage(userId, battleId, text, name);
      io.in(battleId).emit('MESSAGE_RESPONSE', messageObj);
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
        .catch(err => err);
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
