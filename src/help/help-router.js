const express = require('express');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth')

const helpRouter = express.Router();

helpRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    res.send('help router running')
  })

module.exports = helpRouter;