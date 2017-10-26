exports.up = function(knex) {
  return knex.schema.createTable('Character', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.integer('pokemonId').notNullable();
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable('Character');
};
