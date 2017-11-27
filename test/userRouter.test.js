// 'use strict';
//
// process.env.NODE_ENV = 'test';
//
// const request = require('supertest');
// const server = require('../server');
// const { addDatabaseHooks } = require('./utils');
//
// describe(
//   'user router',
//   addDatabaseHooks(() => {
//     //
//     //GET w/o token
//     //
//     it('GET /users', done => {
//       request(server)
//         .get('/users')
//         .set('Accept', 'application/json')
//         .expect(response => {
//           delete response.body.hashedPassword;
//         })
//         .expect(200, [
//           {
//             id: 1,
//             name: 'Cang',
//             email: 'Cang.b.le@gmail.com'
//           }
//         ])
//         .expect('Content-Type', /json/);
//       done();
//     });
//     //
//     //GET w/ Id
//     //
//     it('GET /users/:id', done => {
//       request(server)
//         .get('/users/1')
//         .set('Accept', 'application/json')
//         .expect(response => {
//           delete response.body.hashedPassword;
//         })
//         .expect(200, [
//           {
//             id: 1,
//             name: 'Cang',
//             email: 'Cang.b.le@gmail.com'
//           }
//         ])
//         .expect('Content-Type', /json/);
//       done();
//     });
//     //
//     //PATCH w/ Id
//     //
//     it('PATCH /users/:id', done => {
//       request(server)
//         .patch('/users/1')
//         .set('Accept', 'application/json')
//         .send({ name: 'Cang', email: 'cang.b.le@gmail.com' })
//         .expect('Content-Type', /json/)
//         .expect(200, [
//           {
//             name: 'Cang',
//             email: 'cang.b.le@gmail.com'
//           }
//         ])
//         .expect('Content-Type', /json/);
//       done();
//     });
//
//     // it('PATCH /users/9000', done => {
//     //   request(server)
//     //     .patch('/users/9000')
//     //     .set('Accept', 'application/json')
//     //     .expect('Content-Type', /plain/)
//     //     .expect(404, 'NOT FOUND', done);
//     // });
//     //
//     // it('PATCH /users/-1', done => {
//     //   request(server)
//     //     .patch('/users/-1')
//     //     .set('Accept', 'application/json')
//     //     .expect('Content-Type', /plain/)
//     //     .expect(404, 'NOT FOUND', done);
//     // });
//     //
//     // it('PATCH /users/one', done => {
//     //   request(server)
//     //     .patch('/users/one')
//     //     .set('Accept', 'application/json')
//     //     .expect('Content-Type', /plain/)
//     //     .expect(404, 'NOT FOUND', done);
//     // });
//     //
//     //POST
//     //
//     it('POST /users', done => {
//       const password = 'supersecret';
//       request(server)
//         .post('/users')
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .send({
//           name: 'Cang',
//           email: 'Cang.b.le@gmail.com',
//           password
//         })
//         .expect(200, {
//           id: 2,
//           name: 'Cang',
//           email: 'Cang.b.le@gmail.com'
//         })
//         .expect('Content-Type', /json/)
//         .end(done);
//     });
//   })
// );
