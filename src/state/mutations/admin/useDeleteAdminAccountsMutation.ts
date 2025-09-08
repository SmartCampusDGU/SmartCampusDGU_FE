import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAdminAccounts } from '@/apis/admin/accounts';
import { ADMIN_ACCOUNTS_QUERY_KEY } from '@/state/queries/admin/useAdminAccountsQuery';

export const useDeleteAdminAccountsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => deleteAdminAccounts(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ACCOUNTS_QUERY_KEY });
    },
  });
};
