import { axiosInstance } from '../axios';
import type { CreateRoomTypeRequest } from '@/types/measurements/CreateRoomTypeRequest'
import type { GetRoomTypesResponse } from '@/types/measurements/GetRoomTypesResponse';
import type { RoomTypeResponseData } from '@/types/measurements/RoomTypeResponse';
import type { DeleteRoomTypeResponse } from '@/types/measurements/DeleteRoomTypeResponse';
/**
 * 방 타입 목록 조회
 */
export const getRoomTypes = async (): Promise<GetRoomTypesResponse> => {
  const response = await axiosInstance.get<GetRoomTypesResponse>('/api/rooms/types');
  return response.data;
};

/**
 * 방 타입 생성
 */
export const createRoomType = async (
  data: CreateRoomTypeRequest
): Promise<RoomTypeResponseData> => {
  const response = await axiosInstance.post<RoomTypeResponseData>('/api/rooms/types', data);
  return response.data;
};

/**
 * 방 타입 수정
 */
export const updateRoomType = async (
  roomTypeId: number,
  data: CreateRoomTypeRequest
): Promise<RoomTypeResponseData> => {
  const response = await axiosInstance.patch<RoomTypeResponseData>(`/api/rooms/types/${roomTypeId}`, data);
  return response.data;
};

/**
 * 방 타입 삭제
 */
export const deleteRoomType = async (
  roomTypeId: number
): Promise<DeleteRoomTypeResponse> => {
  const response = await axiosInstance.delete<DeleteRoomTypeResponse>(`/api/rooms/types/${roomTypeId}`);
  return response.data;
};
