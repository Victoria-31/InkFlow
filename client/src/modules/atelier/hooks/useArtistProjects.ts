import { useQuery } from '@tanstack/react-query';
import type { ProjectStatus } from '@inkflow/shared';
import { getArtistProjects } from '@/request/artist-space';

export function useArtistProjects(status?: ProjectStatus) {
  return useQuery({ queryKey: ['artistProjects', status], queryFn: () => getArtistProjects(status) });
}
