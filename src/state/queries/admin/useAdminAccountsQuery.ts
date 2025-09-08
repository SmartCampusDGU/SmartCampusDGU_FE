import { useQuery } from '@tanstack/react-query';
import { getAdminAccounts } from '@/apis/admin/accounts';
import type { AdminAccountItem } from '@/types/admin/AdminAccountItemType';

export const ADMIN_ACCOUNTS_QUERY_KEY = ['adminAccounts'];

export const useAdminAccountsQuery = () => {
  return useQuery({
    queryKey: ADMIN_ACCOUNTS_QUERY_KEY,
    queryFn: async (): Promise<AdminAccountItem[]> => {
      const res = await getAdminAccounts();
      return res.data; 
    },
    staleTime: 30_000,
  });
};
