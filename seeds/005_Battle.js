exports.seed = function(knex) {
  return knex('Battle')
    .del()
    .then(() => {
      return knex('Battle').insert([
        {
          id: 1,
          status: 'pending',
          userOneId: 1
        },
        {
          id: 2,
          status: 'pending',
          userOneId: 2
        },
        {
          id: 3,
          status: 'progress',
          userOneId: 3,
          userTwoId: 4
        },
        {
          id: 4,
          status: 'progress',
          userOneId: 5,
          userTwoId: 6,
          state: JSON.stringify({
            playerid: 'Cang',
            turn: false,
            deckzone: [1, 2, 3, 4]
          })
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Battle_id_seq"', (SELECT MAX("id") FROM "Battle"))`
      )
    );
};
