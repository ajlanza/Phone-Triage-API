const xss = require('xss');

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
  insertSolution(db, newSolution){
    return db
      .insert(newSolution)
      .into('solutions')
      .returning('*')
      .then(([solution]) => solution)
  },
  serializeSolution(solution) {
    return { 
      id: solution.id,
      problem_id: solution.problem_id,
      problem_type: solution.problem_type,
      title: xss(solution.title),
      content: xss(solution.content),
      worked_count: solution.worked_count
    }
  },
}

module.exports = SolutionsService;