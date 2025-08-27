export interface LogInResponseData {
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
}