import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';
import { createArtistAccount, createClientAccount, createProject, sessionCookie } from '../test/fixtures.js';

// Runs against a real PostgreSQL database (Docker locally, service container in CI)
const prefix = `client-space-${Date.now()}`;
const accountIds: number[] = [];
let artistId: number;
let artistCookie: string;
let clientCookie: string;
let linkedProjectId: number;
let otherProjectId: number;

beforeAll(async () => {
  const artist = await createArtistAccount(`${prefix}-ren`);
  const client = await createClientAccount(`${prefix}-client`);
  accountIds.push(artist.id, client.id);
  artistId = artist.artist!.id;

  artistCookie = sessionCookie(artist.id, 'ARTIST');
  clientCookie = sessionCookie(client.id, 'CLIENT');
  linkedProjectId = (await createProject(artistId, client.id)).id;
  // Still a prospect request: no client account linked yet
  otherProjectId = (await createProject(artistId)).id;
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
    const res = await request(app).get(`/api/client/projects/${linkedProjectId}`).set('Cookie', artistCookie);

    expect(res.status).toBe(403);
  });

  it('returns a project the client is linked to', async () => {
    const res = await request(app).get(`/api/client/projects/${linkedProjectId}`).set('Cookie', clientCookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: linkedProjectId, status: 'REQUEST' });
  });

  it('returns 404 for a project the client is not linked to', async () => {
    const res = await request(app).get(`/api/client/projects/${otherProjectId}`).set('Cookie', clientCookie);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: 'project_not_found' });
  });
});
