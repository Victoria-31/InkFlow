import type { ProjectRequest } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as artistRepository from '../repositories/artist.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as tagRepository from '../repositories/tag.repository.js';

export async function createProjectRequest(username: string, request: ProjectRequest) {
  const artist = await artistRepository.findByUsername(username);
  if (!artist) {
    throw new HttpError(404, 'artist_not_found');
  }

  // The form only shows the artist's working half-days; the API enforces it too
  const workingSlots = new Set(artist.workingSlots);
  if (request.availability.some((slot) => !workingSlots.has(slot))) {
    throw new HttpError(400, 'validation_error', { availability: 'not_working_slot' });
  }

  // Styles are optional; an empty list passes this check
  const tagIds = [...new Set(request.tagIds)];
  if ((await tagRepository.countByIds(tagIds)) !== tagIds.length) {
    throw new HttpError(400, 'validation_error', { tagIds: 'unknown_tag' });
  }

  return projectRepository.createRequest(artist.id, { ...request, tagIds });
}
