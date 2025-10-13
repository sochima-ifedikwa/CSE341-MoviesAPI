process.env.NODE_ENV = 'test';
const request = require('supertest');

// 🔹 Mock do database antes de importar o app
jest.mock('../../data/database', () => ({
  getDatabase: jest.fn(() => ({
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        deleteOne: jest.fn(() => Promise.resolve({ deletedCount: 1 })),
      }))
    }))
  }))
}));

const app = require('../../server');

describe('Protected Actors routes', () => {
  let cookie;

  // 🧪 Antes de todos os testes, cria login fake
  beforeAll(async () => {
    const loginRes = await request(app)
      .get('/test-login')
      .expect(200);

    cookie = loginRes.headers['set-cookie'];
    console.log('Cookie from auth test:', cookie);
  });

  it('Blocks DELETE /actors/:id if not logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5'); // sem cookie

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/access/i);
  });

  it('Allows DELETE /actors/:id if logged in', async () => {
    const res = await request(app)
      .delete('/actors/64fcd3f5f4a4e0b1a2c3d4e5')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
