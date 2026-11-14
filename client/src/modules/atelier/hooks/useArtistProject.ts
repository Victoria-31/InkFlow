import { useQuery } from '@tanstack/react-query';
import { getArtistProject } from '@/request/artist-space';

export function useArtistProject(id: number) {
  // No retry: a 404 will not change
  return useQuery({ queryKey: ['artistProject', id], queryFn: () => getArtistProject(id), retry: false });
}
