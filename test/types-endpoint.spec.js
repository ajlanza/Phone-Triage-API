const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Types Endpoints', function() {
  let db;
  const testTypes  = helpers.makeTypesArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  })

  describe(`Get /api/types`, () => {
    context(`Given there are 'types' in the database`, () => {
      it('responds with 200 and all of the types', () => {
        
        return supertest(app)
          .get('/api/types')
          .expect(200, testTypes)
      })
    })
  })

  describe(`GET api/types/:type_id`, () => {
    context (`Given no types`, () => {
      it(`responds with 404`, () => {
        const type_id = 2442020;
        return supertest(app)
          .get(`/api/types/${type_id}`)
          .expect(404, { error: { message: `Problem type does not exist.` }})
      })
    })

    context(`Given there are types in the database`, () => {
      it(`responds with 400 if not given an integer`, () => {
        const typeId = 'not an integer';
        return supertest(app)
          .get(`/api/types/${typeId}`)
          .expect(400, { error: { message: `Id must be an integer.`} })
      })

      it(`responds with 200 and the specified type`, () => {
        const typeId = 2;
        const testTypeIndex = typeId -1;
        const expectedType = helpers.makeExpectedType(
          testTypes[testTypeIndex],
        )

        return supertest(app)
          .get(`/api/types/${typeId}`)
          .expect(200, expectedType)
        })
    })
  })
})