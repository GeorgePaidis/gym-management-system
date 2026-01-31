import { TestServer } from './testSetup';
import User from '../models/user.model';
import Schedule from '../models/schedule.model';
import bcrypt from 'bcrypt';

describe('Schedule API Tests', () => {
  const server = new TestServer();
  let adminToken: string;
  let memberToken: string;

  beforeAll(async () => {
    await server.start();

    // Δημιουργία διαχειριστή
    const adminHash = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@gym.com',
      password: adminHash,
      firstname: 'Admin',
      lastname: 'User',
      role: 'ADMIN'
    });

    // Σύνδεση διαχειριστή
    const adminLogin = await server.getRequest()
      .post('/api/auth/login')
      .send({
        email: 'admin@gym.com',
        password: 'admin123'
      });
    adminToken = adminLogin.body.token;

    // Δημιουργία μέλους
    const memberHash = await bcrypt.hash('member123', 10);
    await User.create({
      email: 'member@gym.com',
      password: memberHash,
      firstname: 'Member',
      lastname: 'User',
      role: 'MEMBER'
    });

    // Σύνδεση μέλους
    const memberLogin = await server.getRequest()
      .post('/api/auth/login')
      .send({
        email: 'member@gym.com',
        password: 'member123'
      });
    memberToken = memberLogin.body.token;

    await Schedule.create({
      monday: [
        { time: '09:00', name: 'Yoga' },
        { time: '18:00', name: 'CrossFit' }
      ],
      tuesday: [
        { time: '10:00', name: 'Pilates' }
      ]
    });
  });

  afterAll(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await server.cleanup();
    await Schedule.create({
      monday: [
        { time: '09:00', name: 'Yoga' },
        { time: '18:00', name: 'CrossFit' }
      ],
      tuesday: [
        { time: '10:00', name: 'Pilates' }
      ]
    });
  });

  test('GET /api/schedule - όλοι μπορούν να δουν το πρόγραμμα (χωρίς authentication)', async () => {
    const response = await server.getRequest()
      .get('/api/schedule');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('monday');
    expect(response.body.monday).toHaveLength(2);
    expect(response.body).toHaveProperty('tuesday');
    expect(response.body.tuesday).toHaveLength(1);
  });

  test('PUT /api/schedule - ο διαχειριστής μπορεί να ενημερώσει όλο το πρόγραμμα', async () => {
    const newSchedule = {
      monday: [
        { time: '08:00', name: 'Morning Yoga' },
        { time: '19:00', name: 'Evening Workout' }
      ],
      wednesday: [
        { time: '17:00', name: 'Boxing' }
      ]
    };

    const response = await server.getRequest()
      .put('/api/schedule')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newSchedule);

    expect(response.status).toBe(200);
    expect(response.body.monday).toHaveLength(2);
    expect(response.body.monday[0]).toHaveProperty('name', 'Morning Yoga');
    expect(response.body).toHaveProperty('wednesday');
    expect(response.body.wednesday[0]).toHaveProperty('name', 'Boxing');
  });

  test('PUT /api/schedule - το μέλος δεν μπορεί να ενημερώσει το πρόγραμμα', async () => {
    const response = await server.getRequest()
      .put('/api/schedule')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        monday: [{ time: '20:00', name: 'Hacked Class' }]
      });

    expect(response.status).toBe(403);
  });

  test('POST /api/schedule/add-class - ο διαχειριστής μπορεί να προσθέσει μάθημα', async () => {
    const response = await server.getRequest()
      .post('/api/schedule/add-class')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        day: 'monday',
        time: '20:00',
        name: 'Evening Yoga'
      });

    expect(response.status).toBe(201);
    
    // Επαλήθευση προσθήκης μαθήματος
    const scheduleResponse = await server.getRequest()
      .get('/api/schedule');
    
    const mondayClasses = scheduleResponse.body.monday;
    const eveningYoga = mondayClasses.find((c: any) => c.name === 'Evening Yoga');
    expect(eveningYoga).toBeDefined();
    expect(eveningYoga).toHaveProperty('time', '20:00');
  });

  test('POST /api/schedule/add-class - επικύρωση δεδομένων λειτουργεί', async () => {
    // Λάθος μορφή ώρας
    const response = await server.getRequest()
      .post('/api/schedule/add-class')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        day: 'monday',
        time: '25:00', // Μη έγκυρη ώρα
        name: 'Invalid Class'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
  });

  test('POST /api/schedule/remove-class - ο διαχειριστής μπορεί να αφαιρέσει μάθημα', async () => {
    // Αρχική επαλήθευση ύπαρξης μαθήματος
    const scheduleBefore = await server.getRequest()
      .get('/api/schedule');
    expect(scheduleBefore.body.monday.some((c: any) => c.name === 'Yoga')).toBe(true);

    // Αφαίρεση μαθήματος
    const response = await server.getRequest()
      .post('/api/schedule/remove-class')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        day: 'monday',
        time: '09:00',
        name: 'Yoga'
      });

    expect(response.status).toBe(200);

    // Επαλήθευση αφαίρεσης μαθήματος
    const scheduleAfter = await server.getRequest()
      .get('/api/schedule');
    expect(scheduleAfter.body.monday.some((c: any) => c.name === 'Yoga')).toBe(false);
    expect(scheduleAfter.body.monday).toHaveLength(1); // Μόνο το CrossFit έμεινε
  });

  test('POST /api/schedule/remove-class - το μέλος δεν μπορεί να αφαιρέσει μάθημα', async () => {
    const response = await server.getRequest()
      .post('/api/schedule/remove-class')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        day: 'monday',
        time: '09:00',
        name: 'Yoga'
      });

    expect(response.status).toBe(403); // Forbidden
  });

  test('Μη έγκυρη ημέρα επιστρέφει σφάλμα', async () => {
    const response = await server.getRequest()
      .post('/api/schedule/add-class')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        day: 'invalidday', // Μη έγκυρη ημέρα
        time: '10:00',
        name: 'Test Class'
      });

    expect(response.status).toBe(400);
  });
});