const SolutionsService = {
  getAllSolutions(knex) {
    return knex.select('*').from('solutions')
  },
  getById(knex, id) {
    return knex
      .from('solutions')
      .select('*')
      .where('id', id)
      .first()
  },
  updateWorkedCount(knex, id, worked_count) {
    return knex('solutions')
      .where({ id })
      .update(worked_count)
  },
}

module.exports = SolutionsService;