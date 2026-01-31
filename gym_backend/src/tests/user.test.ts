import { TestServer } from './testSetup';
import User from '../models/user.model';
import bcrypt from 'bcrypt';

describe('User API Tests', () => {
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

  // Βοηθητική συνάρτηση για δημιουργία χρηστών και λήψη JWT tokens
  const createTestUserAndLogin = async (role: 'ADMIN' | 'MEMBER', emailIdentifier: string = Date.now().toString()) => {
    const email = `${emailIdentifier}@gym.com`;
    const hash = await bcrypt.hash('password123', 10);
    
    const user = await User.create({
      email,
      password: hash,
      firstname: role,
      lastname: 'User',
      role: role
    });
    
    const loginResponse = await server.getRequest()
      .post('/api/auth/login')
      .send({ email, password: 'password123' });
      
    return { token: loginResponse.body.token, userId: user._id.toString() };
  };

  test('GET /api/users - ο διαχειριστής μπορεί να δει όλους τους χρήστες', async () => {
    const admin = await createTestUserAndLogin('ADMIN', 'adminlist');
    await createTestUserAndLogin('MEMBER', 'memberlist1');
    await createTestUserAndLogin('MEMBER', 'memberlist2');

    const response = await server.getRequest()
      .get('/api/users')
      .set('Authorization', `Bearer ${admin.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/users - το μέλος δεν μπορεί να δει όλους τους χρήστες', async () => {
    const member = await createTestUserAndLogin('MEMBER', 'memberforbid');

    const response = await server.getRequest()
      .get('/api/users')
      .set('Authorization', `Bearer ${member.token}`);

    expect(response.status).toBe(403);
  });

  test('GET /api/users/profile - ο χρήστης μπορεί να δει το δικό του προφίλ', async () => {
    const member = await createTestUserAndLogin('MEMBER', 'memberprofile');

    const response = await server.getRequest()
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${member.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'memberprofile@gym.com');
    expect(response.body).toHaveProperty('_id', member.userId);
  });

  test('GET /api/users/:id - ο διαχειριστής μπορεί να δει οποιονδήποτε χρήστη', async () => {
    const admin = await createTestUserAndLogin('ADMIN', 'adminview');
    const member = await createTestUserAndLogin('MEMBER', 'membertoview');

    const response = await server.getRequest()
      .get(`/api/users/${member.userId}`)
      .set('Authorization', `Bearer ${admin.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', member.userId);
  });

  test('POST /api/users - δημιουργία νέου χρήστη (register)', async () => {
    const response = await server.getRequest()
      .post('/api/users')
      .send({
        email: 'newuser@gym.com',
        password: 'newuser123',
        firstname: 'New',
        lastname: 'User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('email', 'newuser@gym.com');
    expect(response.body).toHaveProperty('role', 'MEMBER');
  });

  test('PUT /api/users/:id - ο διαχειριστής μπορεί να ενημερώσει οποιονδήποτε χρήστη', async () => {
    const admin = await createTestUserAndLogin('ADMIN', 'adminupdate');
    const member = await createTestUserAndLogin('MEMBER', 'membertoupdate');

    const response = await server.getRequest()
      .put(`/api/users/${member.userId}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        firstname: 'Updated',
        phone: '1234567890'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstname', 'Updated');
  });

  test('PUT /api/users/:id - το μέλος μπορεί να ενημερώσει μόνο τον εαυτό του', async () => {
    const member = await createTestUserAndLogin('MEMBER', 'selfupdate');

    const response = await server.getRequest()
      .put(`/api/users/${member.userId}`)
      .set('Authorization', `Bearer ${member.token}`)
      .send({
        firstname: 'MyNewName'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstname', 'MyNewName');
  });

  test('PUT /api/users/:id - το μέλος δεν μπορεί να ενημερώσει άλλους χρήστες', async () => {
    const member = await createTestUserAndLogin('MEMBER', 'memberhacker');
    const otherUser = await createTestUserAndLogin('MEMBER', 'victim');

    const response = await server.getRequest()
      .put(`/api/users/${otherUser.userId}`)
      .set('Authorization', `Bearer ${member.token}`)
      .send({
        firstname: 'Hacked'
      });

    expect(response.status).toBe(403);
  });

  test('DELETE /api/users/:id - ο διαχειριστής μπορεί να διαγράψει χρήστη', async () => {
    const admin = await createTestUserAndLogin('ADMIN', 'admindelete');
    const userToDelete = await createTestUserAndLogin('MEMBER', 'todelete');

    const response = await server.getRequest()
      .delete(`/api/users/${userToDelete.userId}`)
      .set('Authorization', `Bearer ${admin.token}`);

    expect(response.status).toBe(200);
  });

  test('DELETE /api/users/:id - το μέλος δεν μπορεί να διαγράψει χρήστες', async () => {
    const member = await createTestUserAndLogin('MEMBER', 'memberdelete');
    const admin = await createTestUserAndLogin('ADMIN', 'admintodelete');

    const response = await server.getRequest()
      .delete(`/api/users/${admin.userId}`)
      .set('Authorization', `Bearer ${member.token}`);

    expect(response.status).toBe(403);
  });
});