import { axiosInstance } from '../axios';
import type { RoomApiResponse } from '@/types/facilities/RoomApiResponse';
import type { CreateRoomRequest } from '@/types/facilities/CreateRoomRequest';
import type { UpdateRoomRequest } from '@/types/facilities/UpdateRoomRequest';
import type { RoomDetail } from '@/types/facilities/RoomDetail';
import type { RoomListItem } from '@/types/facilities/RoomListItem';

/**
 * 방 목록 조회 (roomType 옵션)
 */
export const getRooms = async (roomTypeId?: number,
  page = 0,
  size = 20): Promise<RoomApiResponse<RoomListItem[]>> => {
     const params: Record<string, any> = { page, size };
  if (roomTypeId !== undefined) {
    params.roomType = roomTypeId;
  }

  const response = await axiosInstance.get<RoomApiResponse<RoomListItem[]>>('/api/rooms', {
    params });
  return response.data;
};

/**
 * 방 상세 조회
 */
export const getRoomDetail = async (roomId: number): Promise<RoomApiResponse<RoomDetail>> => {
  const response = await axiosInstance.get<RoomApiResponse<RoomDetail>>(`/api/rooms/${roomId}`);
  return response.data;
};

/**
 * 방 생성
 */
export const createRoom = async (data: CreateRoomRequest): Promise<RoomApiResponse<Record<string, number>>> => {
  const response = await axiosInstance.post<RoomApiResponse<Record<string, number>>>('/api/rooms', data);
  return response.data;
};

/**
 * 방 정보 수정
 */
export const updateRoom = async (
  roomId: number,
  data: UpdateRoomRequest
): Promise<RoomApiResponse<RoomDetail>> => {
  const response = await axiosInstance.patch<RoomApiResponse<RoomDetail>>(`/api/rooms/${roomId}`, data);
  return response.data;
};
