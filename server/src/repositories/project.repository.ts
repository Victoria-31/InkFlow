import type { Prisma } from '@prisma/client';
import type { ProjectRequest, ProjectStatus } from '@inkflow/shared';
import { prisma } from '../db/prisma.js';

// Maps the API vocabulary to the database columns; only renamed fields are listed.
// consent is checked by validation and is not stored.
export function createRequest(artistId: number, request: ProjectRequest) {
  const {
    firstName,
    lastName,
    email,
    description,
    budgetMin,
    budgetMax,
    availability,
    flexibleSchedule,
    tagIds,
    consent,
    ...project
  } = request;

  return prisma.project.create({
    data: {
      ...project,
      artistId,
      prospectFirstName: firstName,
      prospectLastName: lastName,
      prospectEmail: email,
      clientNote: description,
      clientBudgetMin: budgetMin,
      clientBudgetMax: budgetMax,
      clientAvailability: availability,
      clientFlexibleSchedule: flexibleSchedule,
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
    select: { id: true, status: true, createdAt: true },
  });
}

const artistListSelect = {
  id: true,
  status: true,
  createdAt: true,
  prospectFirstName: true,
  prospectLastName: true,
  bodyArea: true,
  clientBudgetMin: true,
  clientBudgetMax: true,
  tags: { select: { tag: { select: { id: true, name: true } } } },
} satisfies Prisma.ProjectSelect;

const artistDetailSelect = {
  ...artistListSelect,
  prospectEmail: true,
  size: true,
  clientNote: true,
  clientAvailability: true,
  clientFlexibleSchedule: true,
} satisfies Prisma.ProjectSelect;

// artistId is the Artist id, not the account id
export function findAllForArtist(accountId: number, status?: ProjectStatus) {
  return prisma.project.findMany({
    where: { artist: { accountId: accountId }, status: status },
    orderBy: { createdAt: 'desc' },
    select: artistListSelect,
  });
}

export function findForArtist(projectId: number, accountId: number) {
  return prisma.project.findFirst({
    where: { id: projectId, artist: { accountId: accountId } },
    select: artistDetailSelect,
  });
}

export function findForClient(projectId: number, accountId: number) {
  return prisma.project.findFirst({
    where: { id: projectId, clientId: accountId },
    select: { id: true, status: true },
  });
}
