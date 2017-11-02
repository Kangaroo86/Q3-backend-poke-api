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
          deckId: 3,
          characterId: 15
        },
        {
          deckId: 3,
          characterId: 16
        },
        {
          deckId: 3,
          characterId: 17
        },
        {
          deckId: 3,
          characterId: 18
        },
        {
          deckId: 3,
          characterId: 14
        },
        {
          deckId: 3,
          characterId: 13
        },
        {
          deckId: 4,
          characterId: 6
        },
        {
          deckId: 4,
          characterId: 16
        },
        {
          deckId: 4,
          characterId: 7
        },
        {
          deckId: 4,
          characterId: 9
        },
        {
          deckId: 4,
          characterId: 10
        },
        {
          deckId: 4,
          characterId: 13
        },
        {
          deckId: 5,
          characterId: 4
        },
        {
          deckId: 5,
          characterId: 16
        },
        {
          deckId: 5,
          characterId: 8
        },
        {
          deckId: 5,
          characterId: 16
        },
        {
          deckId: 5,
          characterId: 11
        },
        {
          deckId: 5,
          characterId: 10
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Card_id_seq"', (SELECT MAX("id") FROM "Card"))`)
    );
};
