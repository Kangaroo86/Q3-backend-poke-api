'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../server');
const { addDatabaseHooks } = require('./utils');

describe(
  'deck router',
  addDatabaseHooks(() => {
    //
    //GET w/o token
    //
    it('GET /decks', done => {
      request(server)
        .get('/decks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, [{ name: 'Starter Deck', wins: 67, losses: 22 }]);
    });
  })
);
