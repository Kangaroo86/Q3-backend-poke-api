//**********SUMMART**********//
//CRUD operation on User Table. Crate token for users and hashed their password
//Function below are not used in production
//EntityController > entityController > entityRouter

const bcrypt = require('bcryptjs');
const JWTenv = require('./../env');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../env');
const { promisify } = require('util');
const signJWT = promisify(jwt.sign);

class EntityController {
  constructor({ userTable }, knex) {
    this._knex = knex;
    this._user = userTable;
    this._bindMethods([
      'getAllUsers',
      'getUserById',
      'updateUser',
      'addUser',
      'createToken'
    ]);
  }

  //************Create Token***********//
  createToken(request, response, next) {
    const scope = {};
    const password = request.body.password;
    const name = request.body.name;

    return this._knex(this._user)
      .where({ name })
      .then(([user]) => {
        if (!user) {
          throw new Error('HTTP_400_bad_user_request');
        }
        scope.user = user;
        return bcrypt.compare(password, user.hashedPassword);
      })
      .then(result => {
        if (!result) {
          throw new Error('HTTP_400_bad_password_request');
        }
        return signJWT({ sub: scope.user.id }, JWT_KEY);
      })
      .then(token => {
        delete scope.user.hashedPassword;
        scope.user.token = token;
        response.json(scope.user);
      })
      .catch(err => {
        if (err.message === 'HTTP_400_bad_user_request') {
          response
            .set('Content-Type', 'text/plain')
            .status(400)
            .send('User does not exist');
        } else if (err.message === 'HTTP_400_bad_password_request') {
          response
            .set('Content-Type', 'text/plain')
            .status(400)
            .send('Password does not exist');
        }
        next(err);
      });
  }

  //****Get all users from database****//
  getAllUsers(request, response, next) {
    try {
      const scope = {};
      this._knex(this._user)
        .select('*')
        .then(users => {
          users.forEach(arrayObj => {
            delete arrayObj.hashedPassword;
            scope.usersObj = users;
          });
        })
        .then(result => {
          response.json(scope);
        });
    } catch (err) {
      next(err);
    }
  }

  //****Get all users by id from database****//
  getUserById(request, response, next) {
    try {
      const userId = request.params.id;
      this._knex(this._user).where('id', userId).then(user => {
        user.forEach(arrayObj => {
          delete arrayObj.hashedPassword;
          response.json(user);
        });
      });
    } catch (err) {
      next(err);
    }
  }

  //****Update user by id from database****//
  //Not used in production
  updateUser(request, response, next) {
    let attributes = {
      name: request.body.name
    };
    this._knex(this._user)
      .where('id', request.params.id)
      .update(attributes, '*')
      .then(result => {
        response.json(result);
      })
      .catch(err => {
        next(err);
      });
  }

  //****Add user to database****//
  addUser(request, response, next) {
    try {
      if (!request.body.password) {
        throw new Error('HTTP_400 Password Needed');
      } else if (!request.body.name) {
        throw new Error('HTTP_400 Name Needed');
      } else {
        // Check for duplicate name
        this._knex(this._user).where('name', request.body.name).then(result => {
          if (result.length > 0) {
            throw new Error('HTTP_400 Duplicate UserName');
          }
        });

        this._knex(this._user).then(() => {
          //using bcrypt to hash password
          bcrypt
            .hash(request.body.password, 12)
            .then(hash_password => {
              return this._knex(this._user).insert(
                {
                  name: request.body.name,
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
                  name: user.name
                },
                JWTenv.JWT_KEY
              );
              response
                .status(200)
                .cookie('token', token, { httpOnly: true })
                .json({
                  id: user.id,
                  name: user.name
                });
            });
        });
      }
    } catch (err) {
      if (err.message === 'HTTP_400 Password Needed') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Password needed');
      } else if (err.message === 'HTTP_400 Name Needed') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Name needed');
      } else if (err.message === 'HTTP_400 Duplicate UserName') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Username already exists');
      } else {
        next(err);
      }
    }
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = EntityController;
