const { createUser } = require('./Factories');
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  MESSAGE_SEND,
  LOGOUT,
  USER_CREATED,
  MESSAGE_RECIEVED
} = require('./Events');

let connectedUsers = {};
let rooms = { g60: [], KingOfGame: [], PalletTown: [] };

module.exports = io =>
  function(socket) {
    console.log('Socket Id *****' + socket.id);

    //***VERIFY USERNAME***//
    socket.on(VERIFY_USER, (name, userId) => {
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
      socket.room = rooms;
      //socket.join(socket.room);

      //auto push 2 users per room. //TODO.if statement to prevent user from getting add to the room when refreshed
      for (const prop in rooms) {
        if (rooms[prop].length < 2) {
          rooms[prop].push(user.name);
          break;
        }
      }

      io.emit(USER_CONNECTED, connectedUsers);
      console.log('user connected------:', connectedUsers);
      console.log('rooms------:', rooms);
    });

    //***USER LOGSOUT***//
    socket.on(LOGOUT, userName => {
      connectedUsers = removeUser(connectedUsers, userName);
      for (const prop in rooms) {
        rooms[prop].forEach(user => {
          let index = rooms[prop].indexOf(user);
          if (user === userName) {
            rooms[prop].splice(index, 1);
          }
        });
      }
      io.emit(USER_DISCONNECTED, connectedUsers);
    });

    //***SEND MESSAGES***//
    socket.on(MESSAGE_SEND, data => {
      io.emit(MESSAGE_RECIEVED, data);
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

    //Checks if the user is in list passed in.
    // function isUser(userList, username) {
    //   return username in userList;
    // }
  };
