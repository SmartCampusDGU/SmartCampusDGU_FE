import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminAccount } from '@/apis/admin/accounts';
import { ADMIN_ACCOUNTS_QUERY_KEY } from '@/state/queries/admin/useAdminAccountsQuery';
import type { CreateMemberRequest } from '@/types/admin/CreateMemberRequestType';

export const useCreateAdminAccountMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMemberRequest) => createAdminAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ACCOUNTS_QUERY_KEY });
    },
  });
};
