import { useQuery } from '@tanstack/react-query';
import { getArtist } from '@/request/artists';

export function useArtist(username: string) {
  // No retry: a 404 will not change by asking again
  return useQuery({ queryKey: ['artist', username], queryFn: () => getArtist(username), retry: false });
}
