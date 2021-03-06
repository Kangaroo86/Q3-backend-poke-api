exports.up = function(knex) {
  return knex.schema.createTable('Deck', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.integer('wins').notNullable().defaultTo(0);
    table.integer('losses').notNullable().defaultTo(0);
    table
      .integer('userId')
      .references('id')
      .inTable('User')
      .notNullable()
      .onDelete('cascade')
      .index();
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable('Deck');
};
