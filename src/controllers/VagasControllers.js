const knex = require('../database/knex');

class VagasController {
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const { user_id } = req.params;

    // Inserindo a nota e retornando o note_id correto
    const [note_id] = await knex('vagas').insert({
      title,
      description,
      user_id
    });

    if (!note_id) {
      return res.status(400).json({ error: 'Erro ao inserir nota.' });
    }

    // Inserindo links relacionados à nota
    const linksInsert = links.map(link => ({
      note_id,
      url: link
    }));

    if (linksInsert.length > 0) {
      await knex('links').insert(linksInsert);
    }

    // Inserindo tags relacionadas à nota
    const tagsInsert = tags.map(name => ({
      note_id,
      name,
      user_id
    }));

    if (tagsInsert.length > 0) {
      await knex('tags').insert(tagsInsert);
    }

    res.json();
  }

  async index(req, res) {
    const { title, tags } = req.query;
    let vagas;
  
    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
  
      vagas = await knex('tags')
        .select([
          'vagas.id',
          'vagas.title',
          'vagas.user_id',
          'vagas.description',
        ])
        .whereLike("vagas.title", `%${title ?? ''}%`)
        .whereIn('tags.name', filterTags)
        .innerJoin('vagas', 'vagas.id', 'tags.note_id')
        .orderBy('vagas.title');
    } else {
      vagas = await knex('vagas')
        .select(['id', 'title', 'description', 'user_id'])
        .whereLike("title", `%${title ?? ''}%`)
        .orderBy('title');
    }
  
    const tagsPerVaga = await knex('tags').select('note_id', 'name');
    const vagasWithTags = vagas.map(vaga => {
      const vagaTags = tagsPerVaga.filter(tag => tag.note_id === vaga.id);
  
      return {
        ...vaga,
        tags: vagaTags.map(tag => tag.name),
      };
    });
  
    return res.json(vagasWithTags);
  }

  async show(req, res){
    const {id} = req.params
    
    const note = await knex('vagas').where({id}).first()
    const tags = await knex('tags').where({ note_id: id}).orderBy('name')
    const links = await knex('links').where({ note_id: id}).orderBy('created_at')

    return res.json({
      ...note,
      tags,
      links
    })
  }

  async delete(req, res){
    const {id} = req.params

    await knex('vagas').where({id}).delete()
    return res.json()
  }
}

module.exports = VagasController;