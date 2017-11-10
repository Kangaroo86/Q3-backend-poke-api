const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../env');
const { promisify } = require('util');
const signJWT = promisify(jwt.sign);

router.post('/token', (request, response, next) => {
  const scope = {};
  const password = request.body.password;

  return knex('User')
    .orderBy('name')
    .where({ name: request.body.name })
    .then(([user]) => {
      if (!user) {
        throw new Error('INVALID_CREDENTAILS');
      }
      scope.user = user;
      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(result => {
      if (result !== true) {
        throw new Error('INVALID_CREDENTAILS');
      }
      return signJWT({ sub: scope.user.id }, JWT_KEY);
    })
    .then(token => {
      delete scope.user.hashedPassword;
      scope.user.token = token;
      response.send(scope.user);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
