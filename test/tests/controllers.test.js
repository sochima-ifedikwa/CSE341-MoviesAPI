process.env.NODE_ENV = 'test';
const request = require('supertest');

// 🔹 Mock do database antes de importar o app
jest.mock('../../data/database', () => ({
  getDatabase: jest.fn(() => ({
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: jest.fn(() => Promise.resolve([{ name: 'Mock Actor' }])),
        })),
        insertOne: jest.fn(() => Promise.resolve({
          acknowledged: true,
          insertedId: 'mockId'
        })),
        deleteOne: jest.fn(() => Promise.resolve({ deletedCount: 1 }))
      }))
    }))
  }))
}));

const app = require('../../server');

describe('Actors API', () => {
  let cookie;

  // 🧪 Antes de todos os testes, cria um login falso
  beforeAll(async () => {
    const loginRes = await request(app)
      .get('/test-login')
      .expect(200);

    cookie = loginRes.headers['set-cookie'];
    console.log('Cookie from test:', cookie);
  });

  it('GET /actors → should return actors list', async () => {
    const res = await request(app).get('/actors');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Mock Actor');
  });

  it('POST /actors → should create a new actor', async () => {
    const newActor = {
      name: "Robert De Niro",
      birthYear: "1943-08-17",
      nationality: "American",
      knownFor: ["The Godfather Part II", "Taxi Driver", "Raging Bull", "Goodfellas"],
      awards: ["Academy Awards", "Golden Globe Award", "Presidential Medal of Freedom", "Cannes Film Festival Award"]
    };

    const res = await request(app)
      .post('/actors')
      .set('Cookie', cookie)
      .send(newActor);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/created/i);
    expect(res.body.contactId).toBe('mockId');
  });

  it('DELETE /actors/:id → should deny if not logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/access/i);
  });

  it('DELETE /actors/:id → should allow if logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
