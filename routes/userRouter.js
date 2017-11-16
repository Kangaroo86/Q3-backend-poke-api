const express = require('express');
const router = express.Router();
const knex = require('../knex');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const JWTenv = require('./../env');
const jwt = require('jsonwebtoken');

const checkForEmptyFieldsHandler = (request, response, next) => {
  if (!request.body.password) {
    next({
      output: { statusCode: 400 },
      message: 'Password needed'
    });
  } else if (!request.body.email) {
    next({
      output: { statusCode: 400 },
      message: 'Email must not be blank'
    });
  } else {
    next();
  }
};

const checkDuplicateUsernameHandler = (request, response, next) => {
  knex('User').where('name', request.body.name).then(result => {
    console.log('POST /users: Checking if name exists: ', request.body.name);
    if (result.length > 0) {
      console.log('Username already exists, result: ', result);
      return next({
        output: { statusCode: 400 },
        message: 'Username already exists'
      });
    }
    next();
  });
};

const checkDuplicateEmailHandler = (request, response, next) => {
  console.log('POST /users: Checking if email exists');
  knex('User').where('email', request.body.email).then(result => {
    if (result.length > 0) {
      return next({
        output: { statusCode: 400 },
        message: 'Email already exists'
      });
    }
    // No email already exists -- next, create the user.
    next();
  });
};

const createUserHandler = (request, response, next) => {
  console.log('This will create a user');
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
      //console.log('this is users-----', users);
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
        name: user.name,
        email: user.email
      });
    });
};

router.post(
  '/users',
  checkForEmptyFieldsHandler,
  checkDuplicateUsernameHandler,
  checkDuplicateEmailHandler,
  createUserHandler
);

router.get('/users', (request, response, next) => {
  knex('User')
    .select('*')
    .then(result => {
      result.map(arrayObj => delete arrayObj.hashedPassword);
      response.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/users/:id(\\d+)', (request, response, next) => {
  knex('User')
    .where('id', request.params.id)
    .then(result => {
      result.map(arrayObj => delete arrayObj.hashedPassword);
      response.json(result);
    })
    .catch(err => {
      next(err);
    });
});

//will not update in the database..why?
//http PATCH localhost:8000/users/23 name="leannlee" email="lean007" password="newpass"
router.patch('/users/:id(\\d+)', (request, response, next) => {
  let attributes = {
    name: request.body.name,
    email: request.body.email
  };
  knex('User')
    .where('id', request.params.id)
    .update(attributes, '*')
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
module.exports = router;
