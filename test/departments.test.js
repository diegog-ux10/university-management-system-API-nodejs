const request = require('supertest');
const app = require('../server');
const { User } = require('../src/models/user');
const { Department } = require('../src/models/department');

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
  // Clear departments before each test
  await Department.deleteMany({});
});

describe('Departments Endpoints', () => {
  it('should create a new department', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mathematics Department',
        code: 'MATH'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Mathematics Department');
  });

  it('should fetch all departments', async () => {
    // Create a test department first
    await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mathematics Department',
        code: 'MATH'
      });

    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});