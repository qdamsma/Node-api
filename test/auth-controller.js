import { describe, it, expect, vi, afterEach } from 'vitest';
import User from '../models/user.js';
import AuthController from '../controllers/auth.js';

describe('Auth Controller - Login', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw an error with code 500 if accessing the database fails', async () => {
    vi.spyOn(User, 'findOne').mockImplementation(() => { throw new Error(); });

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    const result = await AuthController.login(req, {}, () => {});
    expect(result).toBeInstanceOf(Error);
    expect(result.statusCode).toBe(500);
  });
});