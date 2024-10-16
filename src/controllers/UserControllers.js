const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');
const knex = require('../database/knex'); // utilizando o Knex para interagir com o banco de dados

class UserControllers {
  async create(request, response) {
    const { name, email, password } = request.body;

    // Verificar se o e-mail já existe no banco de dados
    const checkUserExist = await knex('users').where({ email }).first();

    if (checkUserExist) {
      throw new AppError('Este e-mail já está em uso.');
    }

    // Gerar hash da senha
    const hashedPassword = await hash(password, 8);

    // Inserir novo usuário no banco de dados
    await knex('users').insert({
      name,
      email,
      password: hashedPassword,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    // Procurar o usuário pelo ID
    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    // Verificar se o e-mail já está em uso por outro usuário
    const userWithUpdatedEmail = await knex('users').where({ email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    // Atualizar os campos se eles forem fornecidos
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    // Verificar se a senha foi fornecida e se a senha antiga foi informada
    if (password && !old_password) {
      throw new AppError('Você não informou a senha antiga.');
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError('A senha antiga não confere.');
      }

      user.password = await hash(password, 8);
    }

    // Atualizar o usuário no banco de dados
    await knex('users')
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
      .where({ id });

    return response.json();
  }
}

module.exports = UserControllers;