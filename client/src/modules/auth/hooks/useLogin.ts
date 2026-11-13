import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LoginInput } from '@inkflow/shared';
import { login } from '@/request/auth';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
    // A cached "not logged in" (401) would send the user straight back to the login page
    onSuccess: () => queryClient.removeQueries({ queryKey: ['currentAccount'] }),
  });
}
