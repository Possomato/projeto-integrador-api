exports.up = knex => knex.schema.createTable('users', table => {
  table.increments('id') // id autoincremento
  table.string('name') // nome do usuário
  table.string('email') // e-mail do usuário
  table.string('password') // senha do usuário
  table.string('avatar').nullable() // avatar opcional

  table.timestamp('created_at').default(knex.fn.now()) // data de criação
  table.timestamp('updated_at').default(knex.fn.now()) // data de atualização
})

exports.down = knex => knex.schema.dropTable('users')