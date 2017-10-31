const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const JWTenv = require('./../env');
const jwt = require('jsonwebtoken');

router.post('users', (request, response, next) => {
  if (!request.body.password) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('Password must be at least 8 characters long');
  } else if (!request.body.email) {
    response
      .set('Content-Type', 'text/plain')
      .status(400)
      .send('Email must not be blank');
  } else {
    bcrypt
      .hash(request.body.password, 12)
      .then(hash_password => {
        return knex('User').insert(
          {
            name: request.body.name,
            email: request.body.email,
            hashedPassword: hash_password
          },
          '*'
        );
      })
      .then(users => {
        const user = users[0];
        let token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email
          },
          JWTenv.JWT_KEY
        );
        response.status(200).cookie('token', token, { httpOnly: true }).json({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        });
      })
      .catch(() =>
        response.status(400).type('text/plain').send('Email already exists')
      );
  }
});

router.get('/users', (request, response, next) => {
  knex('User').select('*').then(result => {
    response.json(result).catch(err => {
      next(err);
    });
  });
});

router.get('/users/:id(\\d+)', (request, response, next) => {
  knex('User').where('id', request.params.id).then(result => {
    response.json(result).catch(err => {
      next(err);
    });
  });
});

router.patch('/users/:id(\\d+)', (request, response, next) => {
  let attributes = {
    name: request.body.name
  };
  knex('User')
    .where('id', request.params.id)
    .insert(attributes, '*')
    .then(result => {
      response.json(result);
    })
    .catch(err => {
      next(err);
    });
  //
});

// const express = require('express');
// const Boom = require('boom');
// const router = express.Router();
//
// const userController = require('./userController');
// const bodyParser = require('body-parser');
//
// router.use(bodyParser.json());
//
// //.all => it requires that all routes from that point on require authentication, and automatically load a user.
// router.post('/user', userController.create);
// router.get('/user', userController.getAll);
// router.all('/user', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
// );
//
// router.get('/user/:id(\\d+)', userController.getById);
// router.patch('/user/:id(\\d+)', userController.update);
// // router.delete('/user/:id(\\d+)', userController.delete);
// router.all('/user/:id(\\d+)', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
// );
//
// module.exports = router;
