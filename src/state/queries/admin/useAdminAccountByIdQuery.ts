import { useQuery } from '@tanstack/react-query';
import { getAdminAccountById } from '@/apis/admin/accounts';
import type { GetAdminAccountByIdResponse } from '@/types/admin/GetAdminAccountByIdResponse';

export const adminAccountByIdQueryKey = (id: number) => ['adminAccount', id];

export const useAdminAccountByIdQuery = (id: number, enabled = true) => {
  return useQuery<GetAdminAccountByIdResponse>({
    queryKey: adminAccountByIdQueryKey(id),
    queryFn: () => getAdminAccountById(id),
    enabled: !!id && enabled, // id가 있어야 실행
    staleTime: 30_000,
  });
};