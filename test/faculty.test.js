const request = require('supertest');
const app = require('../server');
const { User } = require('../src/models/user');
const { Department } = require('../src/models/department');
const { Faculty } = require('../src/models/faculty'); // Assuming you have this model

let token;
let departmentId;

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

  // Create test department
  const departmentResponse = await request(app)
    .post('/api/departments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Department',
      code: 'TEST'
    });

  departmentId = departmentResponse.body._id;
});

beforeEach(async () => {
  // Clear faculty before each test
  await Faculty.deleteMany({});
});

describe('Faculty Endpoints', () => {
  it('should create a new faculty member', async () => {
    const res = await request(app)
      .post('/api/faculty')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Anna Lopez',
        email: 'anna.lopez@university.com',
        department: departmentId
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Dr. Anna Lopez');
  });

  it('should fetch all faculty members', async () => {
    // Create a test faculty member first
    await request(app)
      .post('/api/faculty')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Anna Lopez',
        email: 'anna.lopez@university.com',
        department: departmentId
      });

    const res = await request(app)
      .get('/api/faculty')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
