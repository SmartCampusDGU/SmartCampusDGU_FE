export interface GetOutliersRequest {
  level?: 'SAFE' | 'CAUTION' | 'DANGER' | 'EMERGENCY';
  checkStatus?: 'PENDING' | 'CONFIRMED';
  roomId?: number;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
  page?: number;
  size?: number;
}