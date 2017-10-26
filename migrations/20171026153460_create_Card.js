exports.up = function(knex) {
  return knex.schema.createTable('Card', table => {
    table.increments('id');
    table
      .integer('deckId')
      .references('id')
      .inTable('Deck')
      .notNullable()
      .onDelete('cascade')
      .index();
    table
      .integer('characterId')
      .references('id')
      .inTable('Character')
      .notNullable()
      .onDelete('cascade')
      .index();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Card');
};
