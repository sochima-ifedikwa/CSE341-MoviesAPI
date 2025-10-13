// test/tests/actors.test.js
process.env.NODE_ENV = 'test';
const request = require('supertest');

// ======================= MOCK DATABASE =======================
jest.mock('../../data/database', () => ({
  getDatabase: jest.fn(() => ({
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        insertOne: jest.fn(actor =>
          Promise.resolve({ acknowledged: true, insertedId: 'mockId' })
        ),
        find: jest.fn(() => ({
          toArray: jest.fn(() => Promise.resolve([{ name: 'Mock Actor' }]))
        })),
        deleteOne: jest.fn(() => Promise.resolve({ deletedCount: 1 }))
      }))
    }))
  }))
}));

const app = require('../../server'); // importe após o mock

// ======================= ACTORS TEST SUITE =======================
describe('Actors API', () => {
  let cookie;

  // Fake login para criar cookie de sessão
  beforeAll(async () => {
    const loginRes = await request(app)
      .get('/test-login')
      .expect(200);

    cookie = loginRes.headers['set-cookie'];
  });

  // GET /actors
  it('GET /actors → should return actors list', async () => {
    const res = await request(app).get('/actors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Mock Actor');
  });

  // POST /actors → agora mockado
  it('POST /actors → should create a actor', async () => {
    const newActor = {
      name: "Robert De Niro",
      birthYear: "1943-08-17",
      nationality: "American",
      knownFor: ["The Godfather Part II", "Taxi Driver"],
      awards: ["Academy Awards"]
    };

    const res = await request(app)
      .post('/actors')
      .set('Cookie', cookie)
      .send(newActor);

    expect(res.statusCode).toBe(201); // deve retornar 201 Created
    expect(res.body.message).toMatch(/created/i);
    expect(res.body.contactId).toBeDefined(); // mock insertedId
  });

  // DELETE /actors/:id → não logado
  it('DELETE /actors/:id → should deny if not logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/access/i);

  });

  // DELETE /actors/:id → logado
  it('DELETE /actors/:id → should allow if logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
