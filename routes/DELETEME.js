const express = require('express');

const router = express.Router();
const knex = require('./../knex');
const bcrypt = require('bcryptjs');

const env = require('./../env');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

router.get('/token', (req, res, next) => {
  console.log('hi', req, env.JWT_KEY);
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, env.JWT_KEY, (err, response) => {
      if (response) res.status(200).json(true);
      else {
        res.status(200).json(false);
      }
    });
  } else {
    //console.log(req.cookies.token);
    res.status(200).json(false);
  }
});

router.post('/token', (req, res) => {
  if (!req.body.email) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Email must not be blank');
    return;
  }

  if (!req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Password must not be blank');
    return;
  }
  bcrypt
    .hash(req.body.password, 12)
    .then(hashedPassword => {
      //console.log(hashedPassword);
      return knex('Doctor').where('email', req.body.email).then(record => {
        return bcrypt
          .compare(req.body.password, record[0].hashedPassword)
          .then(response => {
            //console.log(req.body.password, record[0].hashedPassword, response);
            if (!response) {
              res.set('Content-Type', 'text/plain');

              res.status(400).send('Bad email or password');
              return;
            } else {
              let token = jwt.sign(
                {
                  id: record[0].id,
                  firstName: record[0].firstName,
                  lastName: record[0].lastName,
                  email: record[0].email
                },
                env.JWT_KEY
              );
              res.cookie('token', token, { httpOnly: true }).json({
                id: record[0].id,
                firstName: record[0].firstName,
                lastName: record[0].lastName,
                email: record[0].email
              });
            }
          });
      });
    })
    .catch(() => {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Bad email or password');
    });
});

router.delete('/token', (req, res) => {
  res.clearCookie('token').json(true);
});

module.exports = router;
