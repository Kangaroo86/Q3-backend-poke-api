exports.up = function(knex) {
  return knex.schema.createTable('User', table => {
    table.increments('id');
    table.string('name').notNullable().defaultTo('');
    table.string('email').notNullable();
    table.specificType('hashedPassword', 'char(60)').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('User');
};
