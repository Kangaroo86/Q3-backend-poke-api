'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../server');
const { addDatabaseHooks } = require('./utils');

describe(
  'user router',
  addDatabaseHooks(() => {
    //
    //POST
    //
    it('POST /users', done => {
      const password = 'supersecret';
      request(server)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ name: 'Cang', email: 'cang.b.le@gmail.com', password })
        .expect(response => {
          delete response.body.createAt;
          delete response.body.updateAt;
        })
        .expect(200, {
          id: 2,
          name: 'Cang',
          email: 'cang.b.le@gmail.com'
        })
        .expect('Content-Type', /json/);
    });
  })
);
