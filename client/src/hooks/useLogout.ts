import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/request/auth';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    // No data from the previous session may stay in the cache
    onSuccess: () => queryClient.clear(),
  });
}
