import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'tester boy',
        email: 'tester@boy.com',
        password_hash: '1234',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const responseA = await request(app)
      .post('/users')
      .send({
        name: 'duplicate boy',
        email: 'duplicate@boy.com',
        password_hash: '1234',
      });

    expect(responseA.body).toHaveProperty('id');

    const responseB = await request(app)
      .post('/users')
      .send({
        name: 'duplicate boy',
        email: 'duplicate@boy.com',
        password_hash: '1234',
      });

    expect(responseB.status).toBe(400);
  });
});
