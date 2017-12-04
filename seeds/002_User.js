exports.seed = function(knex, Promise) {
  return knex('User')
    .del()
    .then(() => {
      return knex('User').insert([
        {
          id: 1,
          name: 'Cang',
          hashedPassword: 'supersecret'
        },
        {
          id: 2,
          name: 'Leann',
          hashedPassword: 'supersecret'
        },
        {
          id: 3,
          name: 'Lisa',
          hashedPassword: 'supersecret'
        },
        {
          id: 4,
          name: 'Nestor',
          hashedPassword: 'supersecret'
        },
        {
          id: 5,
          name: 'Helen',
          hashedPassword: 'supersecret'
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"User_id_seq"', (SELECT MAX("id") FROM "User"))`)
    );
};
