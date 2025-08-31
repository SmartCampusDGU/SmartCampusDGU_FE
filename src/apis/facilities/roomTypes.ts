import { axiosInstance } from '../axios';
import type { CreateRoomTypeRequestData } from '@/types/facilities/CreateRoomTypeRequestType'
import type { GetRoomTypesResponseData } from '@/types/facilities/GetRoomTypesResponseType';
import type { RoomTypeResponseData } from '@/types/facilities/RoomTypeResponseType';
import type { DeleteRoomTypeResponseData } from '@/types/facilities/DeleteRoomTypeResponseType';
/**
 * 방 타입 목록 조회
 */
export const getRoomTypes = async (): Promise<GetRoomTypesResponseData> => {
  const response = await axiosInstance.get<GetRoomTypesResponseData>('/api/rooms/types');
  return response.data;
};

/**
 * 방 타입 생성
 */
export const createRoomType = async (
  data: CreateRoomTypeRequestData
): Promise<RoomTypeResponseData> => {
  const response = await axiosInstance.post<RoomTypeResponseData>('/api/rooms/types', data);
  return response.data;
};

/**
 * 방 타입 수정
 */
export const updateRoomType = async (
  roomTypeId: number,
  data: CreateRoomTypeRequestData
): Promise<RoomTypeResponseData> => {
  const response = await axiosInstance.patch<RoomTypeResponseData>(`/api/rooms/types/${roomTypeId}`, data);
  return response.data;
};

/**
 * 방 타입 삭제
 */
export const deleteRoomType = async (
  roomTypeId: number
): Promise<DeleteRoomTypeResponseData> => {
  const response = await axiosInstance.delete<DeleteRoomTypeResponseData>(`/api/rooms/types/${roomTypeId}`);
  return response.data;
};
