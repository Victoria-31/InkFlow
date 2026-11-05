import type { PublicArtist } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as artistRepository from '../repositories/artist.repository.js';
import * as tagRepository from '../repositories/tag.repository.js';

export async function getPublicArtist(username: string): Promise<PublicArtist> {
  const artist = await artistRepository.findPublicProfileByUsername(username);
  if (!artist) {
    throw new HttpError(404, 'artist_not_found');
  }
  const styles = await tagRepository.findAll();

  // Explicit list: only these fields leave the API
  return {
    username: artist.username,
    firstName: artist.account.firstName,
    lastName: artist.account.lastName,
    bio: artist.bio,
    city: artist.city,
    portrait: artist.portrait,
    workingSlots: artist.workingSlots,
    specialties: artist.tags.map(({ tag }) => tag),
    styles,
  };
}
