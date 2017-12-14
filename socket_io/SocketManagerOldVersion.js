// const { createUser } = require('./Factories');
// const {
//   VERIFY_USER,
//   USER_CONNECTED,
//   USER_DISCONNECTED,
//   MESSAGE_SEND,
//   LOGOUT,
//   MESSAGE_RECIEVED
// } = require('./Events');
//
// let connectedUsers = {};
// let rooms = { g60: [], KingOfGame: [], PalletTown: [] };
//
// module.exports = io =>
//   function(socket) {
//     console.log('Socket Id *****' + socket.id);
//
//     //***VERIFY USERNAME***//
//     socket.on(VERIFY_USER, (name, callback) => {
//       if (isUser(connectedUsers, name)) {
//         callback({ isUser: true, user: null });
//       } else {
//         callback({ isUser: false, user: createUser({ name: name }) });
//       }
//     });
//
//     //***USER CONNECTS W/ USERNAME***//
//     socket.on(USER_CONNECTED, user => {
//       console.log('user-----', user);
//       connectedUsers = addUser(connectedUsers, user);
//       socket.user = user;
//       socket.room = rooms;
//       socket.join(socket.room);
//
//       //auto push 2 users per room.
//       for (const prop in rooms) {
//         if (rooms[prop].length < 2) {
//           rooms[prop].push(user.name);
//           break;
//         }
//       }
//
//       io.emit(USER_CONNECTED, connectedUsers);
//       console.log('socket connected------:', socket);
//       console.log('user connected------:', connectedUsers);
//       console.log('rooms------:', rooms);
//     });
//
//     //***USER LOGSOUT***//
//     socket.on(LOGOUT, () => {
//       connectedUsers = removeUser(connectedUsers, socket.user.name);
//       io.emit(USER_DISCONNECTED, connectedUsers);
//     });
//
//     //***SEND MESSAGES***//
//     socket.on(MESSAGE_SEND, data => {
//       io.emit(MESSAGE_RECIEVED, data);
//     });
//
//     //Adds user to list passed in.
//     function addUser(userList, user) {
//       let newList = Object.assign({}, userList);
//       newList[user.name] = user;
//       return newList;
//     }
//
//     //Removes user from the list passed in.
//     function removeUser(userList, username) {
//       let newList = Object.assign({}, userList);
//       delete newList[username];
//       return newList;
//     }
//
//     //Checks if the user is in list passed in.
//     function isUser(userList, username) {
//       return username in userList;
//     }
//   };
