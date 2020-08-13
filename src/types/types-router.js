const express = require('express');
const xss = require('xss');
const TypesService = require('./types-service');

const typesRouter = express.Router();
const jsonParser = express.json();

const serializeType = type => ({
  id: type.id,
  name: xss(type.name),
  type: type.type,
})

typesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TypesService.getAllTypes(knexInstance)
      .then(types => {
        res.json(types.map(serializeType))
      })
      .catch(next)
  })

typesRouter
  .route('/:type_id')
  .all((req, res, next) => {
    TypesService.getById(
      req.app.get('db'),
      req.params.type_id
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
  })
  .get((req, res, next) => {
    res.json(serializeType(res.type))
  })

module.exports = typesRouter;