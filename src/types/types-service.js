const TypesService = {
    getAllTypes(knex) {
      return knex.select('*').from('problem_types')
    },
    getById(knex, typeId) {
      return knex
        .from('problem_types')
        .select('*')
        .where('id', typeId)
        .first()
    },
  }
  
  module.exports = TypesService;