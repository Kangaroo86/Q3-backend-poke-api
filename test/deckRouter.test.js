// 'use strict';
//
// process.env.NODE_ENV = 'test';
//
// const request = require('supertest');
// const server = require('../server');
// const { addDatabaseHooks } = require('./utils');
//
// describe(
//   'deck router',
//   addDatabaseHooks(() => {
//     //
//     //GET w/o token
//     //
//     it('GET /decks', done => {
//       request(server)
//         .get('/decks')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200, { deckname: 'Starter Deck', wins: 67, losses: 22 });
//       done();
//     });
//     //
//     //GET w/ Id
//     //
//     it('GET /decks/:id', done => {
//       request(server)
//         .get('/decks/:id')
//         .set('Accept', 'application/json')
//         .expect(200, [{ deckname: 'Starter Deck', wins: 67, losses: 22 }]);
//       done();
//     });
//     //
//     //PATCH w/ Id
//     //
//     it('PATCH /decks/:id', done => {
//       request(server)
//         .patch('/users/1')
//         .set('Accept', 'application/json')
//         .send({ deckname: 'Cang' })
//         .expect('Content-Type', /json/)
//         .expect(200, {
//           deckname: 'Cang'
//         })
//         .expect('Content-Type', /json/);
//       done();
//     });
//     //
//     //POST /decks
//     //
//     it('POST /decks', done => {
//       request(server)
//         .post('/decks')
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .send({ deckname: 'Cang', wins: 4, losses: 3, userId: 1 })
//         .expect(200, { id: 2, name: 'Cang', wins: 4, losses: 3, userId: 1 })
//         .expect('Content-Type', /json/);
//       done();
//     });
//   })
// );
