const express = require('express');
const xss = require('xss');
const path = require('path');
const ProblemsService = require('./problems-service');
const TypesService = require('../types/types-service');

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
    // validate the problem type
    const typeError = TypesService.validateTypes(problem_type);
      if(typeError){
        return res.status(400).json({ error: { message : "problem_type must be an integer" }})
      }
    // check if the problem type exists in the database
    TypesService.getById(
      req.app.get('db'), 
      problem_type
    )
    .then((type) => {
      // if it doesn't then return an error message
      if(!type)
        return res.status(400).json({
          error: { message: "Incorrect problem type"}
        })
      })
    .catch(next)
      .then(() => {
        // if it does then add the new problem
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