const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const usersRouter = require('../src/users/users-router')
const { expect } = require('chai')

describe('Users Endpoints', function() {
  let db

  const{ testUsers } = helpers.makePhoneTriageFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup before', () => helpers.cleanTables(db))

  afterEach('cleanup after each', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'password', 'first_name', 'last_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'test password',
          first_name: 'test firt_name',
          last_name: 'test last_name',
        }
    
        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          username: 'test username',
          password: '1234567',
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be at least 8 characters` })
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = { 
          username: 'test username',
          password: '*'.repeat(73),
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` })
      })

      it(`responds with 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          username: 'test username',
          password: ' 1Aa!2Bb@',
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, {error : `Password must not start or end with empty spaces` })
      })

      it(`responds with 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = { 
          username: 'test username',
          password: '1Aa!2Bb@ ',
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces`})
      })

      it.skip(`responds with 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          username: 'test username',
          password: '111AAaabb',
          first_name: 'test first_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, {error: `Password must contain 1 upper case, lower case, number, and special character`})
      })

      it(`responds 400 'User name already taken' when username isn't unique`, () => {
        const duplicateUer = {
          username: testUser.username,
          password: '11AAaa!!',
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUer)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcrypted password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res=> {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.first_name).to.eql(newUser.first_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
          .expect(res => 
            db
              .from('users')
              .select('*')
              .where({id: res.body.id})
              .first()
              .then(row => {
                  expect(row.username).to.eql(newUser.username)
                  expect(row.first_name).to.eql(newUser.first_name)
                  expect(row.last_name).to.eql(newUser.last_name)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
            )
      })
    })
  })
})