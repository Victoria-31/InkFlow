import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('API errors', () => {
  it('answers an unknown API route with a Problem Details 404', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.type).toBe('application/problem+json');
    expect(response.body).toMatchObject({ status: 404, code: 'route_not_found' });
  });

  it('answers malformed JSON with a 400', async () => {
    const response = await request(app)
      .post('/api/artists/ren/projects')
      .set('Content-Type', 'application/json')
      .send('{"firstName":');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ code: 'invalid_json' });
  });

  it('answers a body over the size limit with a 413', async () => {
    const response = await request(app)
      .post('/api/artists/ren/projects')
      .send({ description: 'a'.repeat(200_000) });

    expect(response.status).toBe(413);
    expect(response.type).toBe('application/problem+json');
    expect(response.body).toMatchObject({ status: 413, code: 'payload_too_large' });
  });
});
