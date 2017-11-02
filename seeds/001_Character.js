exports.seed = function(knex, Promise) {
  return knex('Character')
    .del()
    .then(() => {
      return knex('Character').insert([
        {
          id: 1,
          name: 'Bulbasaur',
          pokemonId: 1
        },
        {
          id: 2,
          name: 'Charmander',
          pokemonId: 4
        },
        {
          id: 3,
          name: 'Squirtle',
          pokemonId: 7
        },
        {
          id: 4,
          name: 'Pikachu',
          pokemonId: 25
        },
        {
          id: 5,
          name: 'Nidoqueen',
          pokemonId: 31
        },
        {
          id: 6,
          name: 'Jigglypuff',
          pokemonId: 39
        },
        {
          id: 7,
          name: 'Golem',
          pokemonId: 76
        },
        {
          id: 8,
          name: 'Gyarados',
          pokemonId: 130
        },
        {
          id: 9,
          name: 'Ditto',
          pokemonId: 132
        },
        {
          id: 10,
          name: 'Snorlax',
          pokemonId: 143
        },
        {
          id: 11,
          name: 'Articuno',
          pokemonId: 144
        },
        {
          id: 12,
          name: 'Zapdo',
          pokemonId: 145
        },
        {
          id: 13,
          name: 'Moltres',
          pokemonId: 146
        },
        {
          id: 14,
          name: 'Mewtwo',
          pokemonId: 150
        },
        {
          id: 15,
          name: 'Mew',
          pokemonId: 151
        },
        {
          id: 16,
          name: 'Groudon',
          pokemonId: 383
        },
        {
          id: 17,
          name: 'Raikou',
          pokemonId: 243
        },
        {
          id: 18,
          name: 'Xerneas',
          pokemonId: 716
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Character_id_seq"', (SELECT MAX("id") FROM "Character"))`
      )
    );
};
