const express = require('express');
const xss = require('xss');
const path = require('path');
const ProblemsService = require('./problems-service');

const problemsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeProblem = problem => ({
  id: problem.id,
  title: xss(problem.title),
  problem_type: problem.problem_type,
})

problemsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ProblemsService.getAllProblems(knexInstance)
      .then(problems => {
        res.json(problems.map(serializeProblem))
      })
      .catch(next)
  })
  .post(jsonBodyParser, ( req, res, next) => {
    const { problem_type, title } = req.body
    const newProblem = { 
      problem_type,
      title
    }

    for (const[key, value] of Object.entries(newProblem))
      if(value == null)
        return res.status(400).json({
          error:`Missing '${key}' in request body`
        })
    
    ProblemsService.insertProblem(
      req.app.get('db'),
      newProblem
    )
      .then(problem => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${problem.id}`))
          .json(ProblemsService.serializeProblem(problem))
      })
      .catch(next)
  })

problemsRouter
  .route('/:problem_id')
  .all((req, res, next) => {
    const problemId = parseInt(req.params.problem_id);
    const problemError = ProblemsService.validateProblems(problemId);
    if(problemError)
      return res.status(400).json({ error: { message: problemError } })
    
    ProblemsService.getById(
      req.app.get('db'),
      problemId
    )
      .then(problem => {
        if (!problem) {
          return res.status(404).json({
            error: { message: `Problem does not exist.` }
          })
        }
        res.problem = problem
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeProblem(res.problem))
  })

module.exports = problemsRouter;