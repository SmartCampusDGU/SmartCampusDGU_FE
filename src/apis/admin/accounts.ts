import { axiosInstance } from '../axios';
import type { GetAdminAccountsResponse } from '@/types/admin/GetAdminAccountsResponseType';
import type { GetAdminAccountByIdResponse } from '@/types/admin/GetAdminAccountByIdResponse';
import type { CreateMemberRequest } from '@/types/admin/CreateMemberRequestType';
import type { CreateMemberResponse } from '@/types/admin/CreateMemberResponseType';
import type { UpdateMemberRequest } from '@/types/admin/UpdateMemberRequestType';
import type { UpdateMemberResponse } from '@/types/admin/UpdateMemberResponseType';
import type { DeleteMembersRequest } from '@/types/admin/DeleteMembersRequestType';
import type { DeleteMembersResponse } from '@/types/admin/DeleteMembersResponseType';

/** 조회 */
export const getAdminAccounts = async (): Promise<GetAdminAccountsResponse> => {
  const res = await axiosInstance.get<GetAdminAccountsResponse>('members');
  return res.data;
};

/** 단일 관리자 계정 조회 */
export const getAdminAccountById = async (
  id: number
): Promise<GetAdminAccountByIdResponse> => {
  const res = await axiosInstance.get(`members/${id}`);
  return res.data.data;
};

/** 생성 */
export const createAdminAccount = async (
  payload: CreateMemberRequest
): Promise<CreateMemberResponse> => {
  const res = await axiosInstance.post<CreateMemberResponse>('members', payload);
  return res.data;
};

/** 수정 */
export const updateAdminAccount = async (
  id: number,
  payload: UpdateMemberRequest
): Promise<UpdateMemberResponse> => {
  // password가 빈 문자열이면 삭제
  const body = { ...payload };
  if (typeof body.password === "string" && body.password.trim() === "") {
    delete body.password; // 빈 문자열/스페이스면 비번 필드 자체를 안 보냄 → 서버는 기존 비번 유지
}

  const res = await axiosInstance.patch<UpdateMemberResponse>(
    `members/${id}`,
    body
  );
  return res.data;
}; 

/** 삭제 */
export const deleteAdminAccounts = async (
  ids: number[]
): Promise<DeleteMembersResponse> => {
  const body: DeleteMembersRequest = { ids };
  const res = await axiosInstance.delete<DeleteMembersResponse>('members', { data: body });
  return res.data;
};
