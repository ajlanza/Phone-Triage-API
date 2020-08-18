require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const problemsRouter = require('./problems/problems-router');
const typesRouter = require('./types/types-router');
const solutionsRouter = require('./solutions/solutions-router');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const helpRouter = require('./help/help-router');
const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(
    cors(
    {
   origin: CLIENT_ORIGIN
    }
  )
);
console.log('client origin')
app.use('/api/problems', problemsRouter);
app.use('/api/solutions', solutionsRouter);
app.use('/api/users', usersRouter)
app.use('/api/types', typesRouter);
app.use('/api/auth', authRouter);
app.use('/api/help', helpRouter);
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});
app.get('/', (req,res) => {
  // res.send('Hello, universe!');
  res.json({ok: true});
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error } 
  }
  res.status(500).json(response)
})

module.exports = app