exports.up = function(knex) {
  return knex.schema.createTable('Battle', table => {
    table.increments('id');
    table.string('status');
    table
      .integer('userOneId')
      .references('id')
      .inTable('User')
      .onDelete('cascade')
      .index();
    table
      .integer('userTwoId')
      .references('id')
      .inTable('User')
      .onDelete('cascade')
      .index();
    table.jsonb('state');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Battle');
};
