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

      it(`responds with 400 if not given an integer`, () => {
        const problemId = 'not an integer';
        return supertest(app)
          .get(`/api/problems/${problemId}`)
          .expect(400, { error: { message: `Id must be an integer.`} })
      })

      it(`responds with 200 and the specified problem`, () => {
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

  describe(`POST api/problems`, () => {
    context(`Validation`, () => {
      it(`responds with 400 when title field is missing`, () => {
        const bodyWithoutTitle = { problem_type: 1 }
        return supertest(app)
          .post(`/api/problems`)
          .send(bodyWithoutTitle)
          .expect(400, { error: `Missing 'title' in request body` })
      })
      it(`responds with 400 when problem_type is missing`, () => {
        const bodyWithoutType = { title: 'problem title' }
        return supertest(app)
          .post(`/api/problems`)
          .send (bodyWithoutType)
          .expect(400, { error: `Missing 'problem_type' in request body` })
      })
      it(`responds with 400 when problem_type is not an integer`, () => {
        const incorrectType = [{
          problem_type: 'not an integer',
          title: 'problem title'
        }]
        return supertest(app)
          .post(`/api/problems`)
          .send (incorrectType)
          .expect(400, { error: `Missing 'problem_type' in request body` })
      })
    })

    context(`Happy path`,() => {
      it(`responds with 201`, () => {
        const correctBody = {
          problem_type: 1,
          title: 'Problem title'
        }
        return supertest(app)
          .post(`/api/problems`)
          .send(correctBody)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.problem_type).to.eql(correctBody.problem_type)
            expect(res.body.title).to.eql(correctBody.title)
          })
      })
    })
  }) 
})