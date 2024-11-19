import request from 'supertest';
import app from './index.js';
/*
describe('GET /', () => {
  it('should return a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
*/

describe('POST /api/newsletter/signup', () => {
  it('it should accept email as json return 200', async () => {
    {
      const response = await request(app)
        .post('/api/newsletter/signup')
        .send({ email: 'cjfinn101@gmail.com' }) //JSON payload
        .set('Accept', 'application/json'); //JSON header
      expect(response.body.success).toBe(true);
    }
  });
});

/*
describe('DELETE /api/newsletter/signup', () => {
  it('it should accept email as json return 200', async () => {
    const response = await request(app)
    .delete('/api/newsletter/signup')
    .send({email: 'cjfinn99@gmail.com'})//JSON payload
    .set('Accept', 'application/json'); //JSON header
    expect(response.body.success).toBe(true);
  });
});
*/
