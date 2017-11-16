const knex = require('../knex');
const bcrypt = require('bcryptjs');
const JWTenv = require('./../env');
const jwt = require('jsonwebtoken');

class UserController {
  constructor({ userTable }) {
    this._user = knex(userTable);
    this._bindMethods(['getAllUser', 'getUserById', 'updateUser', 'addUser']);
  }

  //***********************************//
  //****Get all users from database****//
  //***********************************//
  getAllUser(request, response, next) {
    this._user
      .select('*')
      .then(result => {
        result.map(arrayObj => delete arrayObj.hashedPassword);
        response.json(result);
      })
      .catch(err => {
        next(err);
      });
  }

  //*****************************************//
  //****Get all users by id from database****//
  //*****************************************//
  getUserById(request, response, next) {
    this._user
      .where('id', request.params.id)
      .then(result => {
        result.map(arrayObj => delete arrayObj.hashedPassword);
        response.json(result);
      })
      .catch(err => {
        next(err);
      });
  }

  //***************************************//
  //****Update user by id from database****//
  //***************************************//
  //will not update in the database..why?
  //http PATCH localhost:8000/users/23 name="leannlee" email="lean007" password="newpass"
  updateUser(request, response, next) {
    let attributes = {
      name: request.body.name,
      email: request.body.email
    };
    this._user
      .where('id', request.params.id)
      .update(attributes, '*')
      .then(result => {
        response.json(result);
      })
      .catch(err => {
        next(err);
      });
  }

  //****************************//
  //****Add user to database****//
  //****************************//
  addUser(request, response, next) {
    if (!request.body.password) {
      response
        .set('Content-Type', 'text/plain')
        .status(400)
        .send('Password Needed');
    } else if (!request.body.email) {
      response
        .set('Content-Type', 'text/plain')
        .status(400)
        .send('Email must not be blank');
    } else {
      // Check to see if the username already exists
      this._user
        .where('name', request.body.name)
        .then(result => {
          if (result.length > 0) {
            response
              .status(400)
              .type('text/plain')
              .send('Username already exists');
            throw new Error();
          }
        })
        .then(() => {
          this._user.where('email', request.body.email).then(result => {
            if (result.length > 0) {
              response
                .status(400)
                .type('text/plain')
                .send('Email already exists');
              throw new Error();
            }
          });
        })
        .then(() => {
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
              response
                .status(200)
                .cookie('token', token, { httpOnly: true })
                .json({
                  id: user.id,
                  name: user.name,
                  email: user.email
                });
            })
            .catch(() =>
              response
                .status(400)
                .type('text/plain')
                .send('Email already exists')
            );
        });
    }
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = UserController;
