import { describe, it, expect } from 'vitest';
import authMiddleware from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = {
        get: function() {
            return null;
        }
    }
   expect(() => authMiddleware(req, {}, () => {})).toThrow('Not authenticated.');
  });
  it('should throw an error if the authorization header is only one string', function() {
    const req = {
        get: function(headerName) {
            return 'xyz';
        }
    };
    expect(() => authMiddleware(req, {}, () => {})).toThrow();
  })
  it('should throw an error if the token cannot be verified', function() {
    const req = {
        get: function(headerName) {
            return 'Bearer xyz';
        }
    };
    expect(() => authMiddleware(req, {}, () => {})).toThrow();
  })
  it('should yield a userId after decoding the token', function() {
    const req = {
        get: function(headerName) {
            return 'Bearer sdsajkja';
        }
    };
    jwt.verify = function() {
        return { userId: 'abc'}
    }
    authMiddleware(req, {}, () => {});
    expect(req).toHaveProperty('userId');
  })
});