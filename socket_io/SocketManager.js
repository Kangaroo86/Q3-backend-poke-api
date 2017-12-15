const knex = require('../knex');

const { createUser } = require('./Factories');
const {
  VERIFY_USER,
  USER_CONNECTED,
  MESSAGE_SEND,
  USER_CREATED,
  MESSAGE_RECIEVED
} = require('./Events');

let connectedUsers = {};
let rooms = { g60: [], KingOfGame: [], PalletTown: [] };

module.exports = io =>
  function(socket) {
    //console.log('Socket Id *****' + socket.id);

    //***VERIFY USERNAME***//
    socket.on(VERIFY_USER, (name, userId, battleId) => {
      //goes on the HOME Page
      let user = {};
      if (userId === 'null') {
        user = createUser({ name: name });
        socket.emit(USER_CREATED, user);
        connectedUsers = addUser(connectedUsers, user);
      } else {
        user.id = userId;
        user.name = name;
      }
      socket.user = user;
      //socket.join(socket.room);

      if (battleId !== 'null') {
        getMessage(battleId);
      }

      io.emit(USER_CONNECTED, connectedUsers);
      //console.log('user connected------:', connectedUsers);
      //console.log('rooms------:', rooms);
    });

    //***SEND MESSAGES***//
    socket.on(MESSAGE_SEND, data => {
      let { userId, battleId, text } = data;

      createMessage(userId, battleId, text);
      io.emit(MESSAGE_RECIEVED, text);
    });

    //Adds user to list passed in.
    function addUser(connectedUsers, user) {
      let newConnectedUsers = Object.assign({}, connectedUsers);
      newConnectedUsers[user.name] = user;
      return newConnectedUsers;
    }

    //Removes user from the list passed in.
    function removeUser(connectedUsers, userName) {
      let newConnectedUsers = Object.assign({}, connectedUsers);
      delete newConnectedUsers[userName];
      return newConnectedUsers;
    }

    function createMessage(userId, battleId, text) {
      knex.transaction(trx => {
        return knex('BattleMessage')
          .transacting(trx)
          .insert({ battleId: battleId, userId: userId, text: text });
      });
    }

    //
    function getMessage(battleId) {
      knex('BattleMessage')
        .select('text')
        .where('battleId', battleId)
        .then(arrayOfText => {
          arrayOfText.forEach(text => {
            io.emit('MESSAGE_RECIEVED', text);
          });
        });
    }

    //Checks if the user is in list passed in.
    // function isUser(userList, username) {
    //   return username in userList;
    // }
  };
