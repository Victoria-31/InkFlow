import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const username = `test-artist-${Date.now()}`;
let artistId: number;
let accountId: number;
let tagId: number;

const validRequest = () => ({
  firstName: 'Léa',
  lastName: 'Martin',
  email: `lea-${Date.now()}@example.com`,
  bodyArea: 'Nuque',
  size: '8 cm',
  tagIds: [tagId],
  budgetMin: 300,
  budgetMax: 450,
  description: 'Un ensō avec quelques tiges de bambou.',
  availability: ['TUE_PM'],
  flexibleSchedule: false,
});

const countProjects = () => prisma.project.count({ where: { artistId } });

beforeAll(async () => {
  const tag = await prisma.tag.upsert({ where: { name: 'Test style' }, update: {}, create: { name: 'Test style' } });
  tagId = tag.id;

  const account = await prisma.account.create({
    data: {
      firstName: 'Ren',
      lastName: 'Test',
      email: `${username}@example.com`,
      password: 'not-a-real-hash',
      role: 'ARTIST',
      artist: { create: { username, city: 'Lyon', workingSlots: ['TUE_PM', 'SAT_AM'] } },
    },
    include: { artist: true },
  });
  accountId = account.id;
  artistId = account.artist!.id;
});

beforeEach(async () => {
  await prisma.project.deleteMany({ where: { artistId } });
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { artistId } });
  await prisma.artist.delete({ where: { id: artistId } });
  await prisma.account.delete({ where: { id: accountId } });
  await prisma.$disconnect();
});

describe('GET /api/artists/:username', () => {
  it('returns the public profile with styles and working half-days', async () => {
    const res = await request(app).get(`/api/artists/${username}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username, firstName: 'Ren', city: 'Lyon', workingSlots: ['TUE_PM', 'SAT_AM'] });
    expect(res.body.styles).toContainEqual({ id: tagId, name: 'Test style' });
  });

  it('returns 404 for an unknown artist', async () => {
    const res = await request(app).get('/api/artists/nobody-here');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body).toMatchObject({ type: 'about:blank', title: 'Not Found', status: 404, code: 'artist_not_found' });
  });
});

describe('POST /api/artists/:username/projects', () => {
  it('creates a REQUEST project linked to the artist, without creating an account', async () => {
    const body = validRequest();
    const res = await request(app).post(`/api/artists/${username}/projects`).send(body);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('REQUEST');

    const project = await prisma.project.findUniqueOrThrow({ where: { id: res.body.id }, include: { tags: true } });
    expect(project).toMatchObject({ artistId, clientId: null, prospectEmail: body.email, clientAvailability: ['TUE_PM'] });
    expect(project.tags).toHaveLength(1);
    expect(await prisma.account.count({ where: { email: body.email } })).toBe(0);
  });

  it('returns every error at once, cross-field rules included, and creates nothing', async () => {
    const res = await request(app).post(`/api/artists/${username}/projects`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ status: 400, code: 'validation_error' });
    expect(res.body.errors).toMatchObject({
      firstName: 'required',
      lastName: 'required',
      email: 'required',
      bodyArea: 'required',
      size: 'required',
      tagIds: 'required',
      description: 'required',
      availability: 'availability_required',
    });
    expect(await countProjects()).toBe(0);
  });

  it('rejects a malformed email', async () => {
    const res = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), email: 'lea@' });

    expect(res.status).toBe(400);
    expect(res.body.errors.email).toBe('invalid_email');
  });

  it('accepts a request without budget', async () => {
    const { budgetMin, budgetMax, ...body } = validRequest();
    const res = await request(app).post(`/api/artists/${username}/projects`).send(body);

    expect(res.status).toBe(201);
  });

  it('rejects a minimum budget above the maximum, or a non-positive amount', async () => {
    const reversed = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), budgetMin: 500, budgetMax: 300 });
    const zero = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), budgetMin: 0 });

    expect(reversed.status).toBe(400);
    expect(reversed.body.errors.budgetMax).toBe('budget_order');
    expect(zero.status).toBe(400);
    expect(zero.body.errors.budgetMin).toBe('invalid_budget');
  });

  it('requires at least one half-day unless the schedule is flexible', async () => {
    const none = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), availability: [] });
    const flexible = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), availability: [], flexibleSchedule: true });

    expect(none.status).toBe(400);
    expect(none.body.errors.availability).toBe('availability_required');
    expect(flexible.status).toBe(201);
  });

  it('rejects a half-day the artist does not work', async () => {
    const res = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), availability: ['MON_AM'] });

    expect(res.status).toBe(400);
    expect(res.body.errors.availability).toBe('not_working_slot');
    expect(await countProjects()).toBe(0);
  });

  it('rejects an unknown style', async () => {
    const res = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), tagIds: [999999] });

    expect(res.status).toBe(400);
    expect(res.body.errors.tagIds).toBe('unknown_tag');
  });

  it('rejects texts above their maximum length', async () => {
    const res = await request(app)
      .post(`/api/artists/${username}/projects`)
      .send({ ...validRequest(), description: 'a'.repeat(2001), firstName: 'a'.repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.errors).toMatchObject({ description: 'too_long', firstName: 'too_long' });
  });

  it('returns 404 for an unknown artist', async () => {
    const res = await request(app).post('/api/artists/nobody-here/projects').send(validRequest());

    expect(res.status).toBe(404);
  });
});
