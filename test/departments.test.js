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
  }, 10000);

  it('should fetch all departments', async () => {
    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
