const knex = require('knex')
const app = require('../src/app')
const { makeProblemsArray } = require('./problems.fixtures')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Problems Endpoints', function() {
  let db 

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () =>db.destroy())

  before('clean the table', () => db.raw('TRUNCATE problems RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE problems RESTART IDENTITY CASCADE'))

  describe(`Get /api/problems`, () => {
    context(`Given no problems`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/problems')
          .expect(200, [])
      })
    })

    context(`Given there are 'problems' in the database`, () => {
      const testProblems = makeProblemsArray();

      beforeEach('insert problems', () => {
        return db
          .into('problems')
          .insert(testProblems)
      })

      it('responds with 200 and all of the problems', () => {
        return supertest(app)
          .get('/api/problems')
          .expect(200, testProblems)
      })
    })
  })
})