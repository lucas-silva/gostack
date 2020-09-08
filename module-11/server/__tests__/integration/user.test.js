import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import User from '../../src/app/models/User';
import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const userAttrs = await factory.attrs('User', { password: '1234' });

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const userAttrs = await factory.attrs('User', { password: '1234' });
    const responseA = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(responseA.body).toHaveProperty('id');

    const responseB = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(responseB.status).toBe(400);
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', { password: '1234' });

    const compareHash = await bcrypt.compare('1234', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
