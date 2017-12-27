exports.up = function(knex) {
  return knex.schema.createTable('BattleMessage', table => {
    table.increments('id');
    table
      .integer('battleId')
      .references('id')
      .inTable('Battle')
      .onDelete('cascade')
      .index();
    table.text('text');
    table
      .integer('userId')
      .references('id')
      .inTable('User')
      .onDelete('cascade')
      .index();
    table.text('name');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('BattleMessage');
};
