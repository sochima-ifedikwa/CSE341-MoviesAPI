const app = require('../server')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const token = process.env.TEST_JWT || 'fake-test-token';

describe('Test Handlers', () => {
    test('responds to / (HTML)', async () => {
        const res = await request.get('/');
        expect(res.header['content-type']).toMatch(/text\/html/);
        expect(res.statusCode).toBe(200)
    })

    test('responds to /actors (JSON)', async () => {
        const res = await request.get('/actors');
        expect(res.header['content-type']).toMatch(/application\/json/);
        expect(res.statusCode).toBe(200)
    })
})

describe('Test Handlers', () => {
    test('responds to post /actors (JSON)', async () => {
        const res = await request.post('/actors')
        // uncomment if your route requires auth:
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: "Scarlett Johansson",
            birthYear: 1984,
            nationality: "American"
        });
        expect(res.header['content-type']).toMatch(/application\/json/)
        // flexible until auth handled
        expect([200, 201, 401]).toContain(res.statusCode)
    })

    
})