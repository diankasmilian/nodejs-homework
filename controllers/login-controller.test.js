import mongoose from 'mongoose';
import app from '../app.js';
import dotenv from 'dotenv';
import request from 'supertest';
import User from '../models/Users.js';

dotenv.config();

const { DB_HOST_TEST } = process.env;

describe('test login controller', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(3000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('test return status 200', async () => {
    const loginData = {
      email: 'test@gmail.com',
      password: 'test123',
    };

    const register = await request(app)
      .post('/api/users/register')
      .send(loginData);
      
    const { statusCode, body } = await request(app)
      .post('/api/users/login')
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body.user).toHaveProperty('email');
    expect(body.user).toHaveProperty('subscription');
    expect(typeof body.token).toBe('string');
    expect(typeof body.user.email).toBe('string');
    expect(typeof body.user.subscription).toBe('string');

    const user = await User.findOne({ email: loginData.email });
    expect(user.email).toBe(loginData.email);
  });
});
