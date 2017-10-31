'use strict';

process.env.NODE_ENV = 'test';

//const { suite, test } = require('mocha');
const request = require('supertest');
// const knex = require('../knex');
const server = require('../server');
const { addDatabaseHooks } = require('./utils');

describe(
  'character routes',
  addDatabaseHooks(() => {
    //
    //GET
    //
    it('GET /character', done => {
      request(server)
        .get('/character')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(
          200,
          [
            {
              name: 'Bulbasaur',
              pokemonId: 1
            },
            {
              name: 'Charmander',
              pokemonId: 4
            },
            {
              name: 'Squirtle',
              pokemonId: 7
            },
            {
              name: 'Pikachu',
              pokemonId: 25
            },
            {
              name: 'Nidoqueen',
              pokemonId: 31
            },
            {
              name: 'Jigglypuff',
              pokemonId: 39
            },
            {
              name: 'Golem',
              pokemonId: 76
            },
            {
              name: 'Gyarados',
              pokemonId: 130
            },
            {
              name: 'Ditto',
              pokemonId: 132
            },
            {
              name: 'Snorlax',
              pokemonId: 143
            },
            {
              name: 'Articuno',
              pokemonId: 144
            },
            {
              name: 'Zapdo',
              pokemonId: 145
            },
            {
              name: 'Moltres',
              pokemonId: 146
            },
            {
              name: 'Mewtwo',
              pokemonId: 150
            },
            {
              name: 'Mew',
              pokemonId: 151
            },
            {
              name: 'Groudon',
              pokemonId: 383
            },
            {
              name: 'Raikou',
              pokemonId: 243
            },
            {
              name: 'Xerneas',
              pokemonId: 716
            }
          ],
          done
        );
    });
  })
);
