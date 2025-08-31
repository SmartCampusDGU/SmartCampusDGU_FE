export interface RoomTypeResponseData {
  code: number;
  message: string;
  data: {
    [key: string]: number;
  };
}