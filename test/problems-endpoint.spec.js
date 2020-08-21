const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Problems Endpoints', function() {
  let db 

  const {
    testUsers,
    testProblems,
    testSolutions
  } = helpers.makePhoneTriageFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () =>db.destroy())

  before('clean the tables', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`Get /api/problems`, () => {
    context(`Given no problems`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/problems')
          .expect(200, [])
      })
    })

    context(`Given there are 'problems' in the database`, () => {
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

  describe (`GET api/problems/:problem_id`, () => {
    context (`Given no problems`, () => {
      it(`responds with 404`, () => {
        const problem_id = 2442020
        return supertest(app)
          .get(`/api/problems/${problem_id}`)
          .expect(404, { error: { message: `Problem does not exist.` }})
      })
    })

    context(`Given there are problems in the database`, () => {
      beforeEach(`insert problems`, () => {
        return db
          .into('problems')
          .insert(testProblems)  
      })
      
      it(`responds with 200 and the specified problem`)
        const problemId = 2;
        const testProblemIndex = problemId -1;
        const expectedProblem = helpers.makeExpectedProblem(
          testProblems[testProblemIndex],
        )

        return supertest(app)
          .get(`/api/problems/${problemId}`)
          .expect(200, expectedProblem)
    })
  })
})