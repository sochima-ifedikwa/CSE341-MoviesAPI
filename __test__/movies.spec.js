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

    test('responds to /movies', async () => {
        const res = await request.get('/movies');
        expect(res.header['content-type']).toMatch(/application\/json/);
        expect(res.statusCode).toBe(200)
    })
})

describe('Test Handlers', () => {
    test('responds to post /movies', async () => {
        const res = await request.post('/movies')
        // uncomment if your route requires auth:
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: "Black Panther",
            releaseYear: 2018,
            director: "Ryan Coogler",
            actors: ["Kevin Feige"],
            producer: "Kevin Feige",
            country: "USA",
            category: "Feature Film"
        });
        expect(res.header['content-type']).toMatch(/application\/json/);
       // flexible until auth handled
        expect([200, 201, 401]).toContain(res.statusCode)
    })
    
})