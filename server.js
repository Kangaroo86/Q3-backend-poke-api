'use strict';

require('./env');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.disable('x-powered-by');

const cors = require('cors');
//const bodyParser = require('body-parser'); dont delete this
const morgan = require('morgan');
const { JWT_KEY } = require('./env');
const jwt = require('express-jwt');
//const cookieParser = require('cookie-parser');

switch (process.env.NODE_ENV) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    app.use(morgan('short'));
    break;
  default:
}

app.use(bodyParser.json());
app.use(cors());
//app.use(cookieParser());

const path = require('path');
app.use(express.static(path.join('public')));

// CSRF protection
// app.use((request, response, next) => {
//   if (/json/.test(request.get('Accept'))) {
//     next();
//     return;
//   }
//   response.sendStatus(406);
// });

const characterRouter = require('./instances/characterRouter');
const deckRouter = require('./instances/deckRouter');
const entityRouter = require('./instances/entityRouter');
const battleRouter = require('./instances/battleRouter');
const battleMessageRouter = require('./instances/battleMessageRouter');

//Don't move this around. Keep its position as it//
app.use(
  jwt({
    secret: JWT_KEY,
    requestProperty: 'jwt.payload',
    credentialsRequired: false
  })
);

app.use(characterRouter);
app.use(deckRouter);
app.use(entityRouter);
app.use(battleRouter);
app.use(battleMessageRouter);
//Don't move this around. Keep its position as it//

app.use((request, response) => {
  response.sendStatus(404);
});

app.use((error, request, response, next) => {
  if (error.output && error.output.statusCode) {
    response
      .status(error.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(error.message);
    return;
  }
  console.error('Error stack', error.stack); // eslint-disable-line no-console
  response.sendStatus(500);
});

const port = process.env.PORT || 3000;

//******dont delete******//
// app.listen(port, () => {
//   if (process.env.NODE_ENV === 'test') return;
//   console.log(`Listening on port ${port}`); // eslint-disable-line no-console
// });

//**************SOCKET-IO**************//

var server = require('http').Server(app); //socket-io
var io = require('socket.io')(server); //socket-io
server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});

//created SocketManger to managed all of socket activities
const SocketManager = require('./socket_io/SocketManager')(io);
//io.on('connection', SocketManager); //socket-io

//**************SOCKET-IO**************//

module.exports = app;
