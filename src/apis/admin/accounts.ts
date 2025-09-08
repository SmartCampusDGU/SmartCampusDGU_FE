import { axiosInstance } from '../axios';
import type { GetAdminAccountsResponse } from '@/types/admin/GetAdminAccountsResponseType';
import type { CreateMemberRequest } from '@/types/admin/CreateMemberRequestType';
import type { CreateMemberResponse } from '@/types/admin/CreateMemberResponseType';
import type { UpdateMemberRequest } from '@/types/admin/UpdateMemberRequestType';
import type { UpdateMemberResponse } from '@/types/admin/UpdateMemberResponseType';
import type { DeleteMembersRequest } from '@/types/admin/DeleteMembersRequestType';
import type { DeleteMembersResponse } from '@/types/admin/DeleteMembersResponseType';

/** 조회 */
export const getAdminAccounts = async (): Promise<GetAdminAccountsResponse> => {
  const res = await axiosInstance.get<GetAdminAccountsResponse>('/api/members');
  return res.data;
};

/** 생성 */
export const createAdminAccount = async (
  payload: CreateMemberRequest
): Promise<CreateMemberResponse> => {
  const res = await axiosInstance.post<CreateMemberResponse>('/api/members', payload);
  return res.data;
};

/** 수정 */
export const updateAdminAccount = async (
  id: number,
  payload: UpdateMemberRequest
): Promise<UpdateMemberResponse> => {
  const res = await axiosInstance.patch<UpdateMemberResponse>(`/api/members/${id}`, payload);
  return res.data;
};

/** 삭제 */
export const deleteAdminAccounts = async (
  ids: number[]
): Promise<DeleteMembersResponse> => {
  const body: DeleteMembersRequest = { ids };
  const res = await axiosInstance.delete<DeleteMembersResponse>('/api/members', { data: body });
  return res.data;
};
