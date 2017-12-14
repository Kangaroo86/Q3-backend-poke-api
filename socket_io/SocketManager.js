const { createUser } = require('./Factories');
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  MESSAGE_SEND,
  LOGOUT,
  MESSAGE_RECIEVED
} = require('./Events');

let connectedUsers = {};
// let rooms = ['g60', 'KingOfGame', 'PalletTown'];
let rooms = { g60: [], KingOfGame: [], PalletTown: [] };

module.exports = io =>
  function(socket) {
    console.log('Socket Id *****' + socket.id);

    //***VERIFY USERNAME***//
    socket.on(VERIFY_USER, (name, callback) => {
      if (isUser(connectedUsers, name)) {
        callback({ isUser: true, user: null });
      } else {
        callback({ isUser: false, user: createUser({ name: name }) });
      }
    });

    //***USER CONNECTS W/ USERNAME***//
    socket.on(USER_CONNECTED, user => {
      connectedUsers = addUser(connectedUsers, user);
      socket.user = user;
      socket.room = Object.keys(rooms)[0]; //default to room g60
      socket.join(socket.room);

      for (const prop in rooms) {
        if (rooms[prop].length < 2) {
          rooms[prop].push(user.name);
          break;
        }
      }

      io.emit(USER_CONNECTED, connectedUsers);
      console.log('socket connected------:', socket);
      console.log('user connected------:', connectedUsers);
      console.log('rooms------:', rooms);
    });

    //***USER LOGSOUT***//
    socket.on(LOGOUT, () => {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
    });

    //***USER DISCONNECTS***//
    // socket.on('disconnect', () => {
    //   if ('user' in socket) {
    //     connectedUsers = removeUser(connectedUsers, socket.user.name);
    //     io.emit(USER_DISCONNECTED, socket.user.name);
    //
    //     updateGlobal(socket, 'disconnected');
    //     socket.leave(socket.room);
    //   }
    // });

    //***SEND MESSAGES***//
    socket.on(MESSAGE_SEND, data => {
      io.emit(MESSAGE_RECIEVED, data);
    });

    //***SEND MESSAGES TO A DEFAULT ROOM***//
    // socket.on('MESSAGE_SEND_ROOM', data => {
    //   //send the message to everyone
    //   console.log(socket.username + ' sent a message');
    //   io.sockets.in(socket.room).emit('updateChat', socket.username, data);
    // });

    // socket.on('switchRoom', newRoom => {
    //   socket.leave(socket.room);
    //   socket.join(newRoom);
    //   //update client
    //   updateClient(socket, socket.username, newRoom);
    //   //update old room
    //   updateChatRoom(socket, 'disconnected');
    //   //change room
    //   socket.room = newRoom;
    //   //update new room
    //   updateChatRoom(socket, 'connected');
    //   updateRoomList(socket, socket.room);
    // });
    //
    // //update single client with this.
    // function updateClient(socket, user, newRoom) {
    //   socket.emit('updateChat', 'SERVER', "You've connected to " + newRoom);
    // }
    //
    // function updateRoomList(socket, currentRoom) {
    //   socket.emit('updateRooms', rooms, currentRoom);
    // }
    //
    // //We will use this function to update the chatroom when a user joins or leaves
    // function updateChatRoom(socket, message) {
    //   socket.broadcast
    //     .to(socket.room)
    //     .emit('updateChat', 'SERVER', socket.user + ' has ' + message);
    // }
    //
    // //We will use this function to update everyone!
    // function updateGlobal(socket, message) {
    //   socket.broadcast.emit(
    //     'updateChat',
    //     'SERVER',
    //     socket.username + ' has ' + message
    //   );
    // }

    //Adds user to list passed in.
    function addUser(userList, user) {
      let newList = Object.assign({}, userList);
      newList[user.name] = user;
      return newList;
    }

    //Removes user from the list passed in.
    function removeUser(userList, username) {
      let newList = Object.assign({}, userList);
      delete newList[username];
      return newList;
    }

    //Checks if the user is in list passed in.
    function isUser(userList, username) {
      return username in userList;
    }
  };
