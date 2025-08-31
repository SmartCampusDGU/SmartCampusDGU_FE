import { axiosInstance } from '../axios';
import type { RoomApiResponseData } from '@/types/facilities/RoomApiResponseType';
import type { CreateRoomRequestData } from '@/types/facilities/CreateRoomRequestType';
import type { UpdateRoomRequestData } from '@/types/facilities/UpdateRoomRequestType';
import type { RoomDetailData } from '@/types/facilities/RoomDetailType';
import type { RoomListItem } from '@/types/facilities/RoomListItemType';

/**
 * 방 목록 조회 (roomType 옵션)
 */
export const getRooms = async (roomType?: string): Promise<RoomApiResponseData<RoomListItem[]>> => {
  const response = await axiosInstance.get<RoomApiResponseData<RoomListItem[]>>('/api/rooms', {
    params: roomType ? { roomType } : {},
  });
  return response.data;
};

/**
 * 방 상세 조회
 */
export const getRoomDetail = async (roomId: number): Promise<RoomApiResponseData<RoomDetailData>> => {
  const response = await axiosInstance.get<RoomApiResponseData<RoomDetailData>>(`/api/rooms/${roomId}`);
  return response.data;
};

/**
 * 방 생성
 */
export const createRoom = async (data: CreateRoomRequestData): Promise<RoomApiResponseData<Record<string, number>>> => {
  const response = await axiosInstance.post<RoomApiResponseData<Record<string, number>>>('/api/rooms', data);
  return response.data;
};

/**
 * 방 정보 수정
 */
export const updateRoom = async (
  roomId: number,
  data: UpdateRoomRequestData
): Promise<RoomApiResponseData<RoomDetailData>> => {
  const response = await axiosInstance.patch<RoomApiResponseData<RoomDetailData>>(`/api/rooms/${roomId}`, data);
  return response.data;
};
