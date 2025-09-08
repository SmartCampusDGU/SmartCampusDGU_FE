import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminAccount } from '@/apis/admin/accounts';
import { ADMIN_ACCOUNTS_QUERY_KEY } from '@/state/queries/admin/useAdminAccountsQuery';
import type { UpdateMemberRequest } from '@/types/admin/UpdateMemberRequestType';

export const useUpdateAdminAccountMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMemberRequest }) =>
      updateAdminAccount(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ACCOUNTS_QUERY_KEY });
    },
  });
};
