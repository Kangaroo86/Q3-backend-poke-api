const { createUser, createMessage, createChat } = require('./Factories');
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING
} = require('./Events');

let connectedUsers = {};
let communityChat = createChat();

module.exports = io =>
  function(socket) {
    console.log('Socket Id ***** ' + socket.id);

    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    //Verify Username
    socket.on(VERIFY_USER, (name, callback) => {
      if (isUser(connectedUsers, name)) {
        callback({ isUser: true, user: null });
      } else {
        callback({ isUser: false, user: createUser({ name: name }) });
      }
    });

    //User Connects with username
    socket.on(USER_CONNECTED, user => {
      connectedUsers = addUser(connectedUsers, user);
      socket.user = user;

      sendMessageToChatFromUser = sendMessageToChat(user.name);
      sendTypingFromUser = sendTypingToChat(user.name);

      io.emit(USER_CONNECTED, connectedUsers);
      console.log(connectedUsers);
    });

    //User disconnects
    socket.on('disconnect', () => {
      if ('user' in socket) {
        connectedUsers = removeUser(connectedUsers, socket.user.name);

        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log('Disconnect', connectedUsers);
      }
    });

    //User logsout
    socket.on(LOGOUT, () => {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log('Disconnect', connectedUsers);
    });

    //Get Community Chat
    socket.on(COMMUNITY_CHAT, callback => {
      callback(communityChat);
    });

    socket.on(MESSAGE_SENT, ({ chatId, message }) => {
      sendMessageToChatFromUser(chatId, message);
    });

    socket.on(TYPING, ({ chatId, isTyping }) => {
      sendTypingFromUser(chatId, isTyping);
    });

    //Returns a function that will take a chat id and a boolean isTyping
    function sendTypingToChat(user) {
      return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, { user, isTyping });
      };
    }

    //Returns a function that will take a chat id and message
    function sendMessageToChat(sender) {
      return (chatId, message) => {
        io.emit(
          `${MESSAGE_RECIEVED}-${chatId}`,
          createMessage({ message, sender })
        );
      };
    }

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
