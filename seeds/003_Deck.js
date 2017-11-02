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
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Deck_id_seq"', (SELECT MAX("id") FROM "Deck"))`)
    );
};
