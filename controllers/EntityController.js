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
      'getAllUser',
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

    console.log('does it go throuhg------------------');

    return this._knex(this._user)
      .where({ name })
      .then(([user]) => {
        if (!user) {
          throw new Error('HTTP_400');
        }
        scope.user = user;
        console.log('my scope-----', scope);
        return bcrypt.compare(password, user.hashedPassword);
      })
      .then(result => {
        console.log('result-----', result);
        return signJWT({ sub: scope.user.id }, JWT_KEY);
      })
      .then(token => {
        console.log('token-----', token);
        delete scope.user.hashedPassword;
        scope.user.token = token;
        console.log('scope result-----', scope);
        response.json(scope.user);
      })
      .catch(err => {
        console.log('my errr------', err);
        if (err.message === 'HTTP_400') {
          response
            .set('Content-Type', 'text/plain')
            .status(400)
            .send('Bad request');
          return;
        }
        next(err);
      });
  }

  //****Get all users from database****//
  getAllUser(request, response, next) {
    try {
      this._knex(this._user).select('*').then(users => {
        users.forEach(arrayObj => {
          delete arrayObj.hashedPassword;
          response.json(users);
        });
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
        user.map(arrayObj => {
          delete arrayObj.hashedPassword;
          response.json(user);
        });
      });
    } catch (err) {
      next(err);
    }
  }

  //****Update user by id from database****//
  //will not update in the database..why?
  //http PATCH localhost:8000/users/23 name="leannlee" email="lean007" password="newpass"
  updateUser(request, response, next) {
    let attributes = {
      name: request.body.name,
      email: request.body.email
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
      } else if (!request.body.email) {
        throw new Error('HTTP_400 Email Needed');
      } else if (!request.body.name) {
        throw new Error('HTTP_400 Name Needed');
      } else {
        // Check for duplicate name
        this._knex(this._user).where('name', request.body.name).then(result => {
          if (result.length > 0) {
            throw new Error('HTTP_400 Duplicate UserName');
          }
        });

        // Check for dupliate email
        this._knex(this._user)
          .where('email', request.body.email)
          .then(result => {
            if (result.length > 0) {
              throw new Error('HTTP_400 Duplicate Email');
            }
          })
          .then(() => {
            //using bcrypt to hash password
            bcrypt
              .hash(request.body.password, 12)
              .then(hash_password => {
                return this._knex(this._user).insert(
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
              });
          });
      }
    } catch (err) {
      if (err.message === 'HTTP_400 Password Needed') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Password needed');
      } else if (err.message === 'HTTP_400 Email Needed') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Email needed');
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
      } else if (err.message === 'HTTP_400 Duplicate Email') {
        response
          .set('Content-Type', 'text/plain')
          .status(400)
          .send('Email already exists');
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
