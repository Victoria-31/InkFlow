import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';
import { AUTH_COOKIE, signAuthToken } from '../utils/session.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const suffix = Date.now();
const accountIds: number[] = [];
const artistIds: number[] = [];
let artistAccountId: number;
let ownProjectId: number;
let otherProjectId: number;
let clientAccountId: number;

async function createArtist(name: string) {
  const account = await prisma.account.create({
    data: {
      firstName: name,
      lastName: 'Test',
      email: `studio-${name}-${suffix}@example.com`,
      passwordHash: 'not-a-real-hash',
      role: 'ARTIST',
      artist: { create: { username: `studio-${name}-${suffix}` } },
    },
    include: { artist: true },
  });
  accountIds.push(account.id);
  artistIds.push(account.artist!.id);
  return account;
}

function createProject(artistId: number) {
  return prisma.project.create({
    data: {
      artistId,
      bodyArea: 'Nuque',
      size: '8 cm',
      clientNote: 'Un ensō.',
      prospectFirstName: 'Léa',
      prospectLastName: 'Martin',
      prospectEmail: `lea-${suffix}@example.com`,
    },
  });
}

const cookieFor = (accountId: number, role: 'ARTIST' | 'CLIENT') =>
  `${AUTH_COOKIE}=${signAuthToken({ sub: String(accountId), role })}`;

beforeAll(async () => {
  const ren = await createArtist('ren');
  const kai = await createArtist('kai');
  artistAccountId = ren.id;
  ownProjectId = (await createProject(ren.artist!.id)).id;
  otherProjectId = (await createProject(kai.artist!.id)).id;

  const client = await prisma.account.create({
    data: { firstName: 'Léa', lastName: 'Test', email: `studio-client-${suffix}@example.com`, passwordHash: 'x', role: 'CLIENT' },
  });
  clientAccountId = client.id;
  accountIds.push(client.id);
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { artistId: { in: artistIds } } });
  await prisma.artist.deleteMany({ where: { id: { in: artistIds } } });
  await prisma.account.deleteMany({ where: { id: { in: accountIds } } });
  await prisma.$disconnect();
});

describe('GET /api/studio/projects/:id', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get(`/api/studio/projects/${ownProjectId}`);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'unauthenticated' });
  });

  it('returns 401 for an expired session', async () => {
    const expiredAt = Math.floor(Date.now() / 1000) - 60;
    const token = jwt.sign({ sub: String(artistAccountId), role: 'ARTIST', exp: expiredAt }, process.env.APP_SECRET!);

    const res = await request(app).get(`/api/studio/projects/${ownProjectId}`).set('Cookie', `${AUTH_COOKIE}=${token}`);

    expect(res.status).toBe(401);
  });

  it('returns 403 for a client', async () => {
    const res = await request(app)
      .get(`/api/studio/projects/${ownProjectId}`)
      .set('Cookie', cookieFor(clientAccountId, 'CLIENT'));

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'forbidden' });
  });

  it('returns the artist own project', async () => {
    const res = await request(app)
      .get(`/api/studio/projects/${ownProjectId}`)
      .set('Cookie', cookieFor(artistAccountId, 'ARTIST'));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: ownProjectId, status: 'REQUEST' });
  });

  it("returns 404 for another artist's project, as if it did not exist", async () => {
    const res = await request(app)
      .get(`/api/studio/projects/${otherProjectId}`)
      .set('Cookie', cookieFor(artistAccountId, 'ARTIST'));

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: 'project_not_found' });
  });

  it.each(['abc', '0', '99999999999'])('returns 404 for the invalid id %s', async (id) => {
    const res = await request(app).get(`/api/studio/projects/${id}`).set('Cookie', cookieFor(artistAccountId, 'ARTIST'));

    expect(res.status).toBe(404);
  });
});
