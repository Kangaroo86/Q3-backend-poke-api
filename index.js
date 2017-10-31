const { JWT_KEY } = require('./env');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('express-jwt');
const UnauthorizedError = require('express-jwt/lib/errors/UnauthorizedError');
const Boom = require('boom');

const server = express();

server.use(bodyParser.json());
server.use(morgan('dev'));
server.use(cors()); // TODO: lock this down further, currently allows ALL requests
server.use(
  jwt({
    secret: JWT_KEY,
    requestProperty: 'jwt.payload',
    credentialsRequired: false,
    audience: 'bloglet',
    issuer: 'bloglet'
  })
);
server.use((request, response, next) => {
  const authenticatedUserId = request.jwt ? request.jwt.payload.sub : undefined;
  request.authenticatedUserId =
    Number.isFinite(authenticatedUserId) && authenticatedUserId > 0
      ? authenticatedUserId
      : null;

  console.error(
    'request.authenticatedUserId-----------: ',
    request.authenticatedUserId
  );
  next();
});

const authenticationRouter = require('./lib/instances/authenticationRouter');
const userRouter = require('./lib/instances/userRouter');
// const articlesRouter = require('./lib/instances/articlesRouter');

server.use(authenticationRouter);
server.use(userRouter);
// server.use(articlesRouter);

server.all('*', (request, response, next) => response.sendStatus(404));

server.use((error, request, response, next) => {
  console.error(error); // eslint-disable-line no-console
  if (
    error instanceof UnauthorizedError ||
    error.typeof === Boom.unauthorized
  ) {
    error = Boom.unauthorized(error.message, ['Bearer']);
  }
  if (!error.isBoom) error = Boom.badImplementation();
  response
    .set(error.output.headers)
    .status(error.output.statusCode)
    .json(error.output.payload);
});

const port =
  process.env.PORT && /^\d+$/.test(process.env.PORT)
    ? parseInt(process.env.PORT)
    : 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
