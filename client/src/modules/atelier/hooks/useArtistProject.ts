import { useQuery } from '@tanstack/react-query';
import { getArtistProject } from '@/request/artist-space';

export function useArtistProject(id: number) {
  // No retry: a 404 (missing or another artist's project) will not change by asking again
  return useQuery({ queryKey: ['artistProject', id], queryFn: () => getArtistProject(id), retry: false });
}
