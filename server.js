'use strict';

require('./env');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const cors = require('cors');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { JWT_KEY } = require('./env');
const jwt = require('express-jwt');

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

// const characterRouter = require('./routes/characterRouter');
// const cardRouter = require('./routes/cardRouter');
//const deckRouter = require('./routes/deckRouter');
//const userRouter = require('./routes/userRouter');
//const signInRouter = require('./routes/signInRouter');

const characterRouter = require('./instances/characterRouter');
const cardRouter = require('./instances/cardRouter');
const deckRouter = require('./instances/deckRouter');
const entityRouter = require('./instances/entityRouter');

app.use(
  jwt({
    secret: JWT_KEY,
    requestProperty: 'jwt.payload',
    credentialsRequired: false
  })
);
app.use(characterRouter);
app.use(cardRouter);
app.use(deckRouter);
app.use(entityRouter);
//app.use(signInRouter);

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

app.listen(port, () => {
  if (process.env.NODE_ENV === 'test') return;
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});

module.exports = app;
