const request = require('supertest');
const app = require('../server');
const { User } = require('../src/models/user');
const { Student } = require('../src/models/student'); // Assuming you have this model

let token;

beforeAll(async () => {
  // Create test user
  const user = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123'
  });

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });

  token = loginResponse.body.token;
});

beforeEach(async () => {
  // Clear students before each test
  await Student.deleteMany({});
});

describe('Students Endpoints', () => {
  it('should create a new student', async () => {
    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@student.com',
        enrollmentNumber: 'E12345'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'John Doe');
  });

  it('should fetch all students', async () => {
    // Create a test student first
    await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@student.com',
        enrollmentNumber: 'E12345'
      });

    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});