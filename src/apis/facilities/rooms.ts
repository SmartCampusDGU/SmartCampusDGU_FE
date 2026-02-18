import { axiosInstance } from '../axios';
import type { RoomApiResponse } from '@/types/facilities/RoomApiResponse';
import type { GetRoomsRequest } from '@/types/facilities/GetRoomsRequest';
import type { GetRoomsResponse } from '@/types/facilities/GetRoomResponse';
import type { CreateRoomRequest } from '@/types/facilities/CreateRoomRequest';
import type { UpdateRoomRequest } from '@/types/facilities/UpdateRoomRequest';
import type { RoomDetail } from '@/types/facilities/RoomDetail';

/**
 * 방 목록 조회 (roomType 옵션)
 */
export const getRooms = async (params: GetRoomsRequest = {}): Promise<RoomApiResponse<GetRoomsResponse>> => {
  const response = await axiosInstance.get<RoomApiResponse<GetRoomsResponse>>(
    'rooms',
    { params }
  );

  return response.data;
};

/**
 * 방 상세 조회
 */
export const getRoomDetail = async (roomId: number): Promise<RoomApiResponse<RoomDetail>> => {
  const response = await axiosInstance.get<RoomApiResponse<RoomDetail>>(`rooms/${roomId}`);
  return response.data;
};

/**
 * 방 생성
 */
export const createRoom = async (data: CreateRoomRequest): Promise<RoomApiResponse<Record<string, number>>> => {
  const response = await axiosInstance.post<RoomApiResponse<Record<string, number>>>('rooms', data);
  return response.data;
};

/**
 * 방 정보 수정
 */
export const updateRoom = async (
  roomId: number,
  data: UpdateRoomRequest
): Promise<RoomApiResponse<RoomDetail>> => {
  const response = await axiosInstance.put<RoomApiResponse<RoomDetail>>(`rooms/${roomId}`, data);
  return response.data;
};
