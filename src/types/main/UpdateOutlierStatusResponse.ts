import type { OutlierLog } from './OutlierLog';

export interface UpdateOutlierStatusResponse {
  code: number;
  message: string;
  data: OutlierLog;
}