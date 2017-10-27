exports.seed = function(knex, Promise) {
  return knex('Character').del().then(() => {
    return knex('Character').insert([
      {
        id: 1,
        name: 'Bulbasaur'
      },
      {
        id: 4,
        name: 'Charmander'
      },
      {
        id: 7,
        name: 'Squirtle'
      },
      {
        id: 152,
        name: 'Chikorita'
      },
      {
        id: 155,
        name: 'Cyndaquil'
      },
      {
        id: 158,
        name: 'Totodile'
      },
      {
        id: 252,
        name: 'Treecko'
      },
      {
        id: 255,
        name: 'Torchic'
      },
      {
        id: 258,
        name: 'Mudkip'
      },
      {
        id: 150,
        name: 'Mewtwo'
      },
      {
        id: 151,
        name: 'Mew'
      },
      {
        id: 25,
        name: 'Pikachu'
      },
      {
        id: 144,
        name: 'Articuno'
      },
      {
        id: 145,
        name: 'Zapdo'
      },
      {
        id: 146,
        name: 'Moltres'
      },
      {
        id: 243,
        name: 'Raikou'
      },
      {
        id: 244,
        name: 'Entei'
      },
      {
        id: 245,
        name: 'Suicune'
      }
    ]);
  });
};
