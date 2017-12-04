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
          userId: 1,
          cards: '1,4,7'
        },
        {
          id: 2,
          deckname: 'WaterDeck',
          wins: 7,
          losses: 1,
          userId: 2,
          cards: '25,31,39'
        },
        {
          id: 3,
          deckname: 'MyEx_Deck',
          wins: 2,
          losses: 9,
          userId: 3,
          cards: '76,130,132'
        },
        {
          id: 4,
          deckname: 'G60_Deck',
          wins: 10,
          losses: 44,
          userId: 4,
          cards: '143,144,145'
        },
        {
          id: 5,
          deckname: 'frontEnd_4_life',
          wins: 10,
          losses: 3,
          userId: 5,
          cards: '146,150,151'
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Deck_id_seq"', (SELECT MAX("id") FROM "Deck"))`)
    );
};
