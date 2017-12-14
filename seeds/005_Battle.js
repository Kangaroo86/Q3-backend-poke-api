exports.seed = function(knex) {
  return knex('Battle')
    .del()
    .then(() => {
      return knex('Battle').insert([
        {
          id: 1,
          status: 'pending',
          userOneId: 1,
          userTwoId: 2
        },
        {
          id: 2,
          status: 'progress',
          userOneId: 3,
          userTwoId: 4
        },
        {
          id: 3,
          status: 'done',
          userOneId: 5,
          userTwoId: 6
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Battle_id_seq"', (SELECT MAX("id") FROM "Battle"))`
      )
    );
};
