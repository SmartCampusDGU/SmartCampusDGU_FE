import { axiosInstance } from '../axios';
import type { LogInRequestData } from '@/types/auth/LogInRequestType';
import type { LogInResponseData } from '@/types/auth/LogInResponseType';
import type { LogOutResponseData } from '@/types/auth/LogOutResponseType';

export const logIn = async (data: LogInRequestData): Promise<string> => {
  const response = await axiosInstance.post<LogInResponseData>('/api/login', data);
  return response.data.data.accessToken;
};

export const logOut = async (): Promise<void> => {
  await axiosInstance.post<LogOutResponseData>('/api/log-out');
};