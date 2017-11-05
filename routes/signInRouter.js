const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const env = require('./../env');
var jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../env');
//const { promisify } = require('util');
//const signJWT = promisify(jwt.sign);

router.get('/token', (request, response, next) => {
  if (request.cookie.token) {
    jwt.verify(request.cookie.token, env.JWT_KEY, (err, response) => {
      if (response) response.status(200).json(true);
      else {
        response.status(200).json(false);
      }
    });
  } else {
    response.status(200).json(false);
  }
});

router.post('/token', (request, response, next) => {
  if (!request.body.name) {
    response.set('Content-Type', 'text/plain');
    response.status(400).send('Name must not be blank');
    return;
  }
  if (!request.body.password) {
    response.set('Content-Type', 'text/plain');
    response.status(400).send('Password must not be blank');
    return;
  }

  return knex('User')
    .where('name', request.body.name)
    .then(record => {
      return bcrypt
        .compare(request.body.password, record[0].hashedPassword)
        .then(response => {
          if (!response) {
            response.set('Content-Type', 'text/plain');

            response.status(400).send('Bad email or password');
            return;
          } else {
            let token = jwt.sign(
              {
                id: record[0].id,
                name: record[0].name,
                email: record[0].email
              },
              env.JWT_KEY
            );
            response.cookie('token', token, { httpOnly: true }).json({
              id: record[0].id,
              name: record[0].name,
              email: record[0].email,
              token: token
            });
          }
        });
    })
    .catch(() => {
      response.set('Content-Type', 'text/plain');
      response.status(400).send('Bad email or password');
    });
});

router.delete('/token', (request, response) => {
  response.clearCookie('token').json(true);
});

module.exports = router;

// router.post('/token', (request, response, next) => {
//   if (!request.body.password) {
//     response.set('Content-Type', 'text/plain');
//     response.status(400).send('Password must not be blank');
//     return;
//   }
//   bcrypt
//     .hash(request.body.password, 12)
//     .then(hashedPassword => {
//       console.log('does hasedpassword-------', hashedPassword);
//       return knex('User').where('email', request.body.email).then(record => {
//         return bcrypt
//           .compare(request.body.password, record[0].hashedPassword)
//           .then(response => {
//             //console.log(request.body.password, record[0].hashedPassword, response);
//             if (!response) {
//               response.set('Content-Type', 'text/plain');
//
//               response.status(400).send('Bad email or password');
//               return;
//             } else {
//               let token = jwt.sign(
//                 {
//                   id: record[0].id,
//                   name: record[0].name,
//                   email: record[0].email
//                 },
//                 env.JWT_KEY
//               );
//               response.cookie('token', token, { httpOnly: true }).json({
//                 id: record[0].id,
//                 name: record[0].name,
//                 email: record[0].email
//               });
//             }
//           });
//       });
//     })
//     .catch(() => {
//       response.set('Content-Type', 'text/plain');
//       response.status(400).send('Bad email or password');
//     });
// });
//
// module.exports = router;

// router.post('/token', (request, response, next) => {
//   const scope = {};
//   //const email = request.body.email;
//   const password = request.body.password;
//
//   return knex('User')
//     .orderBy('email')
//     .where({ email: request.body.email })
//     .then(([user]) => {
//       if (!user) {
//         throw new Error('INVALID_CREDENTAILS');
//       }
//       scope.user = user;
//       return bcrypt.compare(password, user.hashedPassword);
//     })
//     .then(result => {
//       if (result !== true) {
//         throw new Error('INVALID_CREDENTAILS');
//       }
//       return signJWT({ sub: scope.user.id }, JWT_KEY);
//     })
//     .then(token => {
//       delete scope.user.hashedPassword;
//       scope.user.token = token;
//
//       response.send(scope.user);
//     })
//     .catch(err => {
//       next(err);
//     });
// });
