const knex = require('../knex');

//const { createUser } = require('./Factories');
//const { VERIFY_USER, USER_CONNECTED, USER_CREATED } = require('./Events');

//let connectedUsers = {};
//let rooms = { g60: [], KingOfGame: [], PalletTown: [] };
module.exports = io =>
  function(socket) {
    console.log('Socket Id *****' + socket.id);

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

    //Tell player to update
    socket.on('STATE_UPDATED', () => {
      var foo = setInterval(() => {
        socket.emit('REFRESH_STATE');
        console.log('waiting for refresh...');
      }, 1000);
      socket.on('REFRESH_DONE', () => {
        console.log('refresh done!!!');
        clearInterval(foo);
      });
    });

    //*Creating room. incoming connections from clients
    // let room = 'testroom';
    // io.sockets.on('connection', socket => {
    //   socket.on('room', room => {
    //     socket.join(room);
    //   });
    // });
    //
    // io.sockets.in(room).emit('message', 'what is going on, party people?');

    //***SEND MESSAGES***//
    socket.on('MESSAGE_CREATE', messageObj => {
      let { userId, battleId, text, name } = messageObj;

      createMessage(userId, battleId, text, name);
      socket.emit('MESSAGE_RESPONSE', messageObj);
      //getMessages(messageObj.battleId);
      //io.emit('MESSAGE_RESPONSE', message);
    });

    //knex createMessage
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

    //knex getMessages
    // function getMessages(battleId) {
    //   knex('BattleMessage')
    //     .select('text', 'userId', 'name')
    //     .where('battleId', battleId)
    //     .then(arrayOfText => {
    //       socket.emit('MESSAGE_RESPONSE', arrayOfText);
    //     });
    // }
  };
