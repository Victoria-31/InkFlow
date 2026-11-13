import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';
import { AUTH_COOKIE, signAuthToken } from '../utils/session.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const suffix = Date.now();
const accountIds: number[] = [];
let artistId: number;
let artistAccountId: number;
let clientAccountId: number;
let linkedProjectId: number;
let otherProjectId: number;

function createProject(clientId: number | null) {
  return prisma.project.create({
    data: {
      artistId,
      clientId,
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
  const artistAccount = await prisma.account.create({
    data: {
      firstName: 'Ren',
      lastName: 'Test',
      email: `client-artist-${suffix}@example.com`,
      passwordHash: 'not-a-real-hash',
      role: 'ARTIST',
      artist: { create: { username: `client-artist-${suffix}` } },
    },
    include: { artist: true },
  });
  artistAccountId = artistAccount.id;
  artistId = artistAccount.artist!.id;

  const client = await prisma.account.create({
    data: { firstName: 'Léa', lastName: 'Test', email: `client-${suffix}@example.com`, passwordHash: 'x', role: 'CLIENT' },
  });
  clientAccountId = client.id;
  accountIds.push(artistAccount.id, client.id);

  linkedProjectId = (await createProject(clientAccountId)).id;
  // Still a prospect request: no client account linked yet
  otherProjectId = (await createProject(null)).id;
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { artistId } });
  await prisma.artist.delete({ where: { id: artistId } });
  await prisma.account.deleteMany({ where: { id: { in: accountIds } } });
  await prisma.$disconnect();
});

describe('GET /api/client/projects/:id', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get(`/api/client/projects/${linkedProjectId}`);

    expect(res.status).toBe(401);
  });

  it('returns 403 for an artist', async () => {
    const res = await request(app)
      .get(`/api/client/projects/${linkedProjectId}`)
      .set('Cookie', cookieFor(artistAccountId, 'ARTIST'));

    expect(res.status).toBe(403);
  });

  it('returns a project the client is linked to', async () => {
    const res = await request(app)
      .get(`/api/client/projects/${linkedProjectId}`)
      .set('Cookie', cookieFor(clientAccountId, 'CLIENT'));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: linkedProjectId, status: 'REQUEST' });
  });

  it('returns 404 for a project the client is not linked to', async () => {
    const res = await request(app)
      .get(`/api/client/projects/${otherProjectId}`)
      .set('Cookie', cookieFor(clientAccountId, 'CLIENT'));

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: 'project_not_found' });
  });
});
