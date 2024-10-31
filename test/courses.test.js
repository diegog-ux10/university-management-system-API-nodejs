const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });
  token = res.body.token;
}, 10000);

describe('Courses Endpoints', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Math 101',
        code: 'MATH101',
        department: 'Department_ID'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Math 101');
  }, 10000);

  it('should fetch all courses', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
