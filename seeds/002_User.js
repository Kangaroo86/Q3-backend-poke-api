exports.seed = function(knex, Promise) {
  return knex('User')
    .del()
    .then(() => {
      return knex('User').insert([
        {
          id: 1,
          name: 'Cang',
          email: 'Cang.b.le@gmail.com',
          hashedPassword: 'supersecret'
        },
        {
          id: 2,
          name: 'Leann',
          email: 'Leann@gmail.com',
          hashedPassword: 'supersecret'
        },
        {
          id: 3,
          name: 'Lisa',
          email: 'Lisa@gmail.com',
          hashedPassword: 'supersecret'
        },
        {
          id: 4,
          name: 'Nestor',
          email: 'g60@gmail.com',
          hashedPassword: 'supersecret'
        },
        {
          id: 5,
          name: 'Helen',
          email: 'Helen@gmail.com',
          hashedPassword: 'supersecret'
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"User_id_seq"', (SELECT MAX("id") FROM "User"))`)
    );
};
