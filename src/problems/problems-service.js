const xss = require('xss');

const ProblemsService = {
  validateProblems(problemId) {
    if (isNaN(problemId)) {
      return 'Id must be an integer.'
    }
    return null
  },
  getAllProblems(knex) {
    return knex.select('*').from('problems')
  },
  getById(knex, problemId) {
    return knex
      .from('problems')
      .select('*')
      .where('id', problemId)
      .first()
  },
  insertProblem(db, newProblem){
    return db
      .insert(newProblem)
      .into('problems')
      .returning('*')
      .then(([problem]) => problem)
  },
  serializeProblem(problem) {
    return { 
      id: problem.id,
      problem_type: xss(problem.problem_type),
      title: xss(problem.title)
    }
  },
}

module.exports = ProblemsService;