import { TestServer } from './testSetup';
import User from '../models/user.model';
import bcrypt from 'bcrypt';

describe('Auth API Tests', () => {
  const server = new TestServer();

  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await server.cleanup();
  });

  test('POST /api/auth/login - successful login', async () => {
    // Δημιουργία δοκιμαστικού χρήστη
    const passwordHash = await bcrypt.hash('test123', 10);
    await User.create({
      email: 'test@gym.com',
      password: passwordHash,
      firstname: 'Test',
      lastname: 'User',
      role: 'MEMBER'
    });

    const response = await server.getRequest()
      .post('/api/auth/login')
      .send({
        email: 'test@gym.com',
        password: 'test123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@gym.com');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const passwordHash = await bcrypt.hash('test123', 10);
    await User.create({
      email: 'test@gym.com',
      password: passwordHash,
      firstname: 'Test',
      lastname: 'User',
      role: 'MEMBER'
    });

    const response = await server.getRequest()
      .post('/api/auth/login')
      .send({
        email: 'test@gym.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});