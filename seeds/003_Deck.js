exports.seed = function(knex, Promise) {
  return knex('Deck')
    .del()
    .then(() => {
      return knex('Deck').insert([
        {
          id: 1,
          deckname: 'StarterDeck',
          wins: 5,
          losses: 6,
          userId: 1
        },
        {
          id: 2,
          deckname: 'WaterDeck',
          wins: 7,
          losses: 1,
          userId: 2
        },
        {
          id: 3,
          deckname: 'MyEx_Deck',
          wins: 2,
          losses: 9,
          userId: 3
        },
        {
          id: 4,
          deckname: 'G60_Deck',
          wins: 10,
          losses: 44,
          userId: 4
        },
        {
          id: 5,
          deckname: 'frontEnd_4_life',
          wins: 10,
          losses: 3,
          userId: 5
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Deck_id_seq"', (SELECT MAX("id") FROM "Deck"))`)
    );
};
