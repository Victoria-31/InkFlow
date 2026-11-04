import type { CreatedProjectRequest, ProjectRequest, PublicArtist } from '@inkflow/shared';
import { http } from './http';

export async function getArtist(username: string) {
  const { data } = await http.get<PublicArtist>(`/artists/${encodeURIComponent(username)}`);
  return data;
}

export async function createProjectRequest(username: string, request: ProjectRequest) {
  const { data } = await http.post<CreatedProjectRequest>(`/artists/${encodeURIComponent(username)}/projects`, request);
  return data;
}
