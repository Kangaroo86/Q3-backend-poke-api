exports.seed = function(knex) {
  return knex('BattleMessage')
    .del()
    .then(() => {
      return knex('BattleMessage').insert([
        {
          id: 1,
          battleId: 1,
          text: 'This is seed data',
          userId: 1
        },
        {
          id: 2,
          battleId: 2,
          text: 'This is userId 2',
          userId: 2
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"BattleMessage_id_seq"', (SELECT MAX("id") FROM "BattleMessage"))`
      )
    );
};
