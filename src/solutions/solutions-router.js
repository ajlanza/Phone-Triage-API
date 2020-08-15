const express = require('express');
const xss = require('xss');
const SolutionsService = require('./solutions-service');

const solutionsRouter = express.Router();
const jsonParser = express.json();

const serializeSolution = solution => ({
  id: solution.id,
  problem_id: solution.problem_id,
  problem_type: solution.problem_type,
  title: xss(solution.title),
  content: xss(solution.content),
  worked_count: solution.worked_count
})

solutionsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SolutionsService.getAllSolutions(knexInstance)
      .then(solutions => {
        console.log(solutions)
        res.json(solutions.map(serializeSolution))
      })
      .catch(next)
  })

solutionsRouter
  .route('/:solution_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    SolutionsService.getById(
      knexInstance,
      req.params.solution_id
    )
      .then(solution => {
        if(!solution) {
          return res.status(400).json({
            error: { message:`Solution does not exist`}
          })
        }
        res.solution = solution
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSolution(res.solution))  
  })
  .patch(jsonParser, (req, res, next) => {
    const { worked_count } = req.body
    // const updateCount ={ worked_count }
    SolutionsService.updateWorkedCount(
      req.app.get('db'),
      req.params.solution_id,
      { worked_count }
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = solutionsRouter;

