import { useQuery } from '@tanstack/react-query';
import { getCurrentAccount } from '@/request/auth';

export function useCurrentAccount() {
  // No retry: a 401 means "not logged in", asking again will not change it
  return useQuery({ queryKey: ['currentAccount'], queryFn: getCurrentAccount, retry: false });
}
