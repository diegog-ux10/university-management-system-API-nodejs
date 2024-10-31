const request = require('supertest');
const app = require('../server');
const { User } = require('../src/models/user');
const { Department } = require('../src/models/department'); // Assuming you have this model
const { Course } = require('../src/models/course'); // Assuming you have this model

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
  // Clear courses before each test
  await Course.deleteMany({});
});

describe('Courses Endpoints', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Math 101',
        code: 'MATH101',
        department: departmentId
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Math 101');
  });

  it('should fetch all courses', async () => {
    // Create a test course first
    await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Math 101',
        code: 'MATH101',
        department: departmentId
      });

    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
