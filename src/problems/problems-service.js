const xss = require('xss');
const typesService = require('../types/types-service')

const ProblemsService = {
  validateProblems(problemId) {
    if (isNaN(problemId)) {
      return 'Id must be an integer.'
    }
    return null
  },
  verifyType(knex, typeId) {
    TypesService.getById(
      knex,
      typeId
    )
      .then(type => {
        if (!type) {
          return res.status(404).json({
            error: { message: `Problem type does not exist.` }
          })
        }
        res.type = type
        next()
      })
      .catch(next)
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
      problem_type: problem.problem_type,
      title: xss(problem.title)
    }
  },
}

module.exports = ProblemsService;