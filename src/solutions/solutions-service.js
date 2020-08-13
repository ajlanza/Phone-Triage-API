const SolutionsService = {
  getAllSolutions(knex) {
    return knex.select('*').from('solutions')
  }
}

module.exports = SolutionsService;