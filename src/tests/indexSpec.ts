import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('test basic endpoint server', () => {
  it('it should response status toBe 200 ', async (): Promise<void> => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
