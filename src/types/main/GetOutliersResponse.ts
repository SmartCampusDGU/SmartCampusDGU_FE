import type { OutlierLog } from './OutlierLog';
import type { PageResponse } from '../common/PageResponse';

export interface GetOutliersResponse {
  code: number;
  message: string;
  data: {
   page: PageResponse;
    outlierLogs: OutlierLog[];
  };
}