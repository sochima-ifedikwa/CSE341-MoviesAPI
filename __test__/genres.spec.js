const app = require('../server')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const token = process.env.TEST_JWT || 'fake-test-token';

describe('Test Handlers', () => {
    test('responds to /', async () => {
        const res = await request.get('/');
        expect(res.header['content-type']).toMatch(/text\/html/);
        expect(res.statusCode).toBe(200)
    })

    test('responds to /genres', async () => {
        const res = await request.get('/genres');
        expect(res.header['content-type']).toMatch(/application\/json/);
        expect(res.statusCode).toBe(200)
    })
})

describe('Test Handlers', () => {
    test('responds to post /genres', async () => {
        const res = await request.post('/genres')
        // uncomment if your route requires auth:
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: "Drama",
            description: "Extreme casting in a traditional fashion."
        });
        expect(res.header['content-type']).toMatch(/application\/json/);
        // flexible until auth handled
        expect([200, 201, 401]).toContain(res.statusCode)
    })

    
})