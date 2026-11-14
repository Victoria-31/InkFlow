import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';
import { createArtistAccount, createClientAccount, createProject, sessionCookie } from '../test/fixtures.js';
import { AUTH_COOKIE } from '../utils/session.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const prefix = `artist-space-${Date.now()}`;
const accountIds: number[] = [];
const artistIds: number[] = [];
let artistCookie: string;
let clientCookie: string;
let emptyArtistCookie: string;
let artistAccountId: number;
let ownProjectId: number;
let otherProjectId: number;
let olderProjectId: number;
let framingProjectId: number;
let tagId: number;

beforeAll(async () => {
  const ren = await createArtistAccount(`${prefix}-ren`);
  const kai = await createArtistAccount(`${prefix}-kai`);
  const mia = await createArtistAccount(`${prefix}-mia`);
  const client = await createClientAccount(`${prefix}-client`);
  accountIds.push(ren.id, kai.id, mia.id, client.id);
  artistIds.push(ren.artist!.id, kai.artist!.id, mia.artist!.id);
  emptyArtistCookie = sessionCookie(mia.id, 'ARTIST');

  artistAccountId = ren.id;
  artistCookie = sessionCookie(ren.id, 'ARTIST');
  clientCookie = sessionCookie(client.id, 'CLIENT');
  const tag = await prisma.tag.create({ data: { name: `${prefix}-style` } });
  tagId = tag.id;

  // Dates fixed so the newest-first order is known
  olderProjectId = (await createProject(ren.artist!.id, null, { createdAt: new Date('2026-11-01T10:00:00Z') })).id;
  ownProjectId = (
    await createProject(ren.artist!.id, null, {
      createdAt: new Date('2026-11-10T10:00:00Z'),
      clientBudgetMin: 300,
      clientBudgetMax: 450,
      clientAvailability: ['TUE_PM'],
      tags: { create: [{ tagId }] },
    })
  ).id;
  framingProjectId = (await createProject(ren.artist!.id, null, { status: 'FRAMING' })).id;
  otherProjectId = (await createProject(kai.artist!.id)).id;
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { artistId: { in: artistIds } } });
  await prisma.artist.deleteMany({ where: { id: { in: artistIds } } });
  await prisma.account.deleteMany({ where: { id: { in: accountIds } } });
  await prisma.tag.delete({ where: { id: tagId } });
  await prisma.$disconnect();
});

describe('GET /api/artist/projects/:id', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get(`/api/artist/projects/${ownProjectId}`);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'unauthenticated' });
  });

  it('returns 401 for an expired session', async () => {
    const expiredAt = Math.floor(Date.now() / 1000) - 60;
    const token = jwt.sign({ sub: String(artistAccountId), role: 'ARTIST', exp: expiredAt }, process.env.APP_SECRET!);

    const res = await request(app).get(`/api/artist/projects/${ownProjectId}`).set('Cookie', `${AUTH_COOKIE}=${token}`);

    expect(res.status).toBe(401);
  });

  it('returns 403 for a client', async () => {
    const res = await request(app).get(`/api/artist/projects/${ownProjectId}`).set('Cookie', clientCookie);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'forbidden' });
  });

  it('returns everything the prospect entered, and nothing more', async () => {
    const res = await request(app).get(`/api/artist/projects/${ownProjectId}`).set('Cookie', artistCookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: ownProjectId,
      status: 'REQUEST',
      createdAt: '2026-11-10T10:00:00.000Z',
      firstName: 'Léa',
      lastName: 'Martin',
      email: 'lea@example.com',
      bodyArea: 'Nuque',
      size: '8 cm',
      styles: [{ id: tagId, name: `${prefix}-style` }],
      budgetMin: 300,
      budgetMax: 450,
      description: 'Un ensō.',
      availability: ['TUE_PM'],
      flexibleSchedule: false,
    });
  });

  it("returns 404 for another artist's project, as if it did not exist", async () => {
    const res = await request(app).get(`/api/artist/projects/${otherProjectId}`).set('Cookie', artistCookie);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: 'project_not_found' });
  });

  it('returns 404 for an unknown project', async () => {
    const res = await request(app).get('/api/artist/projects/2147483647').set('Cookie', artistCookie);

    expect(res.status).toBe(404);
  });

  it.each(['abc', '0', '0x10', '1e3', '2147483648'])('returns 400 for the malformed id %s', async (id) => {
    const res = await request(app).get(`/api/artist/projects/${id}`).set('Cookie', artistCookie);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ code: 'validation_error', errors: { id: 'invalid_id' } });
  });
});

describe('GET /api/artist/projects', () => {
  it('returns 403 for a client', async () => {
    const res = await request(app).get('/api/artist/projects').set('Cookie', clientCookie);

    expect(res.status).toBe(403);
  });

  it("lists only the artist's requests, newest first", async () => {
    const res = await request(app).get('/api/artist/projects?status=REQUEST').set('Cookie', artistCookie);

    expect(res.status).toBe(200);
    expect(res.body.map((project: { id: number }) => project.id)).toEqual([ownProjectId, olderProjectId]);
    expect(res.body[0]).toEqual({
      id: ownProjectId,
      status: 'REQUEST',
      createdAt: '2026-11-10T10:00:00.000Z',
      firstName: 'Léa',
      lastName: 'Martin',
      bodyArea: 'Nuque',
      styles: [{ id: tagId, name: `${prefix}-style` }],
      budgetMin: 300,
      budgetMax: 450,
    });
  });

  it('lists every status without a filter', async () => {
    const res = await request(app).get('/api/artist/projects').set('Cookie', artistCookie);

    expect(res.body.map((project: { id: number }) => project.id)).toContain(framingProjectId);
    expect(res.body).toHaveLength(3);
  });

  it('returns an empty list when the artist has no request', async () => {
    const res = await request(app).get('/api/artist/projects?status=REQUEST').set('Cookie', emptyArtistCookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 400 for an unknown status', async () => {
    const res = await request(app).get('/api/artist/projects?status=DONE').set('Cookie', artistCookie);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ code: 'validation_error', errors: { status: 'invalid_status' } });
  });
});
