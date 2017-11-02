exports.seed = function(knex, Promise) {
  return knex('Card')
    .del()
    .then(() => {
      return knex('Card').insert([
        {
          deckId: 1,
          characterId: 1
        },
        {
          deckId: 1,
          characterId: 2
        },
        {
          deckId: 1,
          characterId: 11
        },
        {
          deckId: 1,
          characterId: 14
        },
        {
          deckId: 2,
          characterId: 4
        },
        {
          deckId: 2,
          characterId: 10
        },
        {
          deckId: 2,
          characterId: 15
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Card_id_seq"', (SELECT MAX("id") FROM "Card"))`)
    );
};
