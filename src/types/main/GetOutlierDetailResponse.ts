import type { OutlierLog } from './OutlierLog';

export interface GetOutlierDetailResponse {
  code: number;
  message: string;
  data: OutlierLog;
}