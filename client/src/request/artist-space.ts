import type { ArtistProjectDetail, ArtistProjectListItem, ProjectStatus } from '@inkflow/shared';
import { http } from './http';

export async function getArtistProjects(status?: ProjectStatus) {
  const { data } = await http.get<ArtistProjectListItem[]>('/artist/projects', { params: { status } });
  return data;
}

export async function getArtistProject(id: number) {
  const { data } = await http.get<ArtistProjectDetail>(`/artist/projects/${id}`);
  return data;
}
