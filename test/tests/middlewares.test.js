process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../server');

const { isAuthenticated } = require('../../middleware/authenticate');

describe('Middleware isAuthenticated', () => {
  it('must block requests without logged in user', () => {
    const req = { session: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'You do not have access.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('must allow requests with logged in user', () => {
    const req = { session: { user: { displayName: 'paulajessica-dev' } } };
    const res = {};
    const next = jest.fn();

    isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
