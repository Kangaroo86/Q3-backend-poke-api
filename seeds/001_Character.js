exports.seed = function(knex, Promise) {
  return knex('Character')
    .del()
    .then(() => {
      return knex('Character').insert([
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
          name: 'Ditto',
          pokemonId: 132
        },
        {
          name: 'Golem',
          pokemonId: 76
        },
        {
          name: 'Nidoqueen',
          pokemonId: 31
        },
        {
          name: 'Snorlax',
          pokemonId: 143
        },
        {
          name: 'Groudon',
          pokemonId: 383
        },
        {
          name: 'Xerneas',
          pokemonId: 716
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
          name: 'Pikachu',
          pokemonId: 25
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
          name: 'Raikou',
          pokemonId: 243
        },
        {
          name: 'Jigglypuff',
          pokemonId: 39
        },
        {
          name: 'Gyarados',
          pokemonId: 130
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Character_id_seq"', (SELECT MAX("id") FROM "Character"))`
      )
    );
};
