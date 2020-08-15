const express = require('express');
const path = require('path');
const AnswersService = require('./answers-service')

const answersRouter = express.Router();

answersRouter
  .route('/')
  .patch((req, res, next) => {
    const { worked_count } = req.body
    
    AnswersService.updateWorkedCount(
      req.app.get('db'),
      id,
      worked_count
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = answersRouter