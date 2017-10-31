'user strict';

process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils');

suite(
  'seeds',
  addDatabaseHooks(() => {
    test('character rows', done => {
      knex('Character')
        .orderBy('pokemonId', 'asc')
        .then(character => {
          console.log('character is:', character[0]);
          const expected = [
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
          ];
          console.log('expect is :', expected[0]);

          for (let i = 0; i < expected.length; i++) {
            assert.deepEqual(
              character[i],
              expected[i],
              `Row id=${i + 1} not the same`
            );
          }
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  })
);
