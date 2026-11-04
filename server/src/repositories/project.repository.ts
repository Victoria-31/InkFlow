import type { ProjectRequest } from '@inkflow/shared';
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
