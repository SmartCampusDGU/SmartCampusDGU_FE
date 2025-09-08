import type { AdminAccountItem } from "./AdminAccountItemType";

export interface GetAdminAccountsResponse {
  code: number;
  message: string;
  data: AdminAccountItem[];
}