const app = require('../src/app')

describe('App', () => {
  it('GET /api/* responds with 200 and json object', () => {
    const test ={ok: true}
    return supertest(app)
      .get('/api/randomendpoint')
      .expect(200, test)
  })
})