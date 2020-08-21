const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Solutions Endpoints', function() {
  let db 

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () =>db.destroy())

  before('clean the table', () => db.raw('TRUNCATE solutions RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE solutions RESTART IDENTITY CASCADE'))

  describe(`Get /api/solutions`, () => {
    context(`Given no solutions`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/solutions')
          .expect(200, [])
      })
    })

    context(`Given there are solutions in the database`, () => {
      const testProblems = helpers.makeProblemsArray();
      const testSolutions = helpers.makeSolutionsArray();

      beforeEach('insert solutions', () => {
        return db
          .into('problems')
          .insert(testProblems)
          .then(() => {
            return db
              .into('solutions')
              .insert(testSolutions)
          })
      })

      it('responds with 200 and all of the solutions', () => {
        return supertest(app)
          .get('/api/solutions')
          .expect(200, testSolutions)
      })
    })
  })
})