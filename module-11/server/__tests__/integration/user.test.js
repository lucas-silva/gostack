import request from 'supertest';
import app from '../../src/app';

describe('User', () => {
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
});
