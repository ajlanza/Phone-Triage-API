const express = require('express');
const xss = require('xss');
const path = require('path');
const SolutionsService = require('./solutions-service');

const solutionsRouter = express.Router();
const jsonBodyParser = express.json();

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
        res.json(solutions.map(serializeSolution))
      })
      .catch(next)
  })
  .post(jsonBodyParser, ( req, res, next) => {
    const { problem_id, problem_type, title, content,  } = req.body
    const newSolution = { 
      problem_id,
      problem_type,
      title,
      content,
      worked_count: 0
    }
    
    for (const[key, value] of Object.entries(newSolution))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      if(typeof(problem_id) != 'number'){
        return res.status(400).json({
          error: `problem_id must be a number`
        })
      }
      if(typeof(problem_type) != 'number'){
        return res.status(400).json({
            error: `problem_type must be a number`
        }) 
      }
      if(title.length < 3) {
        return res.status(400).json({
          error:`title must be at least 3 characters`
        })
      }
      if(content.length < 3) {
        return res.status(400).json({
          error:`content must be at least 3 characters`
        })
      }
      

    SolutionsService.insertSolution(
      req.app.get('db'),
      newSolution
    )
      .then(solution => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${solution.id}`))
          .json(SolutionsService.serializeSolution(solution))
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
            error: { message:`Solution does not exist.`}
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
  .patch(jsonBodyParser, (req, res, next) => {
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

