export interface UpdateOutlierStatusRequest {
  checkStatus: 'PENDING' | 'CONFIRMED';
  actionStatus: 'NONE' | 'IN_PROGRESS' | 'DONE';
}