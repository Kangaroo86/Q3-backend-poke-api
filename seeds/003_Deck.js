exports.seed = function(knex, Promise) {
  return knex('Deck')
    .del()
    .then(() => {
      return knex('Deck').insert([
        {
          name: 'StarterDeck',
          wins: 5,
          losses: 6,
          userId: 22
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Deck_id_seq"', (SELECT MAX("id") FROM "Deck"))`)
    );
};
