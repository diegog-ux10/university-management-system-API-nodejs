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
  }, 10000);

  it('should fetch all students', async () => {
    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
