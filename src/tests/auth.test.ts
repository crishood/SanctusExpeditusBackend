import app from '../server';
import request from 'supertest';
import pool from '@config/mySql';
import { API_ROUTES } from '@app/core/constants/api';

jest.mock('@config/mySql', () => ({
  query: jest.fn(),
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return 200 and token on successful login', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          email: 'test@example.com',
          password: '$2b$10$somehashedpassword',
        },
      ]);

      const response = await request(app)
        .post(API_ROUTES.AUTH.LOGIN)
        .send({ email: 'test@example.com', password: 'Test1234!' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 400 with invalid credentials', async () => {
      const response = await request(app)
        .post(API_ROUTES.AUTH.LOGIN)
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 with missing email', async () => {
      const response = await request(app)
        .post(API_ROUTES.AUTH.LOGIN)
        .send({ password: 'Test1234!' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 with missing password', async () => {
      const response = await request(app)
        .post(API_ROUTES.AUTH.LOGIN)
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
