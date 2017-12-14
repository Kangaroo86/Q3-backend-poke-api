const bcrypt = require('bcryptjs');

const DEFAULT_HASHED_PASSWORD = bcrypt.hashSync('super', 12);

exports.seed = function(knex, Promise) {
  return knex('User')
    .del()
    .then(() => {
      return knex('User').insert([
        {
          id: 1,
          name: 'cang',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 2,
          name: 'leann',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 3,
          name: 'lisa',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 4,
          name: 'nestor',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 5,
          name: 'helen',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        },
        {
          id: 6,
          name: 'anthony',
          hashedPassword: DEFAULT_HASHED_PASSWORD
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"User_id_seq"', (SELECT MAX("id") FROM "User"))`)
    );
};
