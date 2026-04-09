import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import User from '../models/user.js';
import AuthController from '../controllers/auth.js'; 

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI
    );
    await User.deleteMany({});
    const user = new User({
      email: 'test@test.com',
      password: 'tester',
      name: 'Test',
      posts: [],
      _id: new mongoose.Types.ObjectId('5c0f66b979af55031b34728a')
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should throw an error with code 500 if accessing the database fails', async () => {
    vi.spyOn(User, 'findOne').mockImplementation(() => { throw new Error(); });

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    const result = await AuthController.login(req, {}, (err) => err);
    expect(result).toBeInstanceOf(Error);
    expect(result.statusCode).toBe(500);

    vi.restoreAllMocks();
  });

  it('should send a response with a valid user status for an existing user', async () => {
    const req = { userId: '5c0f66b979af55031b34728a' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };

    await AuthController.getUserStatus(req, res, () => {});
    expect(res.statusCode).toBe(200);
    expect(res.userStatus).toBe('New');
  });
});