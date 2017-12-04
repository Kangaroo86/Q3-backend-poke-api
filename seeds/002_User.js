const bcrypt = require('bcryptjs');

const DEFAULT_HASHED_PASSWORD = bcrypt.hashSync('supersecret', 12);

exports.seed = function(knex, Promise) {
  return knex('User')
    .del()
    .then(() => {
      return knex('User').insert([
        {
          id: 1,
          name: 'Cang',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 2,
          name: 'Leann',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 3,
          name: 'Lisa',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 4,
          name: 'Nestor',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 5,
          name: 'Helen',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"User_id_seq"', (SELECT MAX("id") FROM "User"))`)
    );
};
