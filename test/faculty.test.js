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

describe('Faculty Endpoints', () => {
  it('should create a new faculty member', async () => {
    const res = await request(app)
      .post('/api/faculty')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Anna Lopez',
        email: 'anna.lopez@university.com',
        department: 'Department_ID'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Dr. Anna Lopez');
  }, 10000);

  it('should fetch all faculty members', async () => {
    const res = await request(app)
      .get('/api/faculty')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
