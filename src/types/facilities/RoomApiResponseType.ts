export interface RoomApiResponseData<T> {
  code: number;
  message: string;
  data: T;
}