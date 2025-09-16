import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN = 'accessToken';

interface ILoginState {
  isLogin: boolean;
  userId: number | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useLoginStore = create<ILoginState>((set) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN) : null;
  let userId: number | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<{ userId: number }>(token);
      userId = decoded.userId;
    } catch {
      userId = null;
      localStorage.removeItem(ACCESS_TOKEN);
    }
  }

  return {
    isLogin: !!token && !!userId,
    userId,
    login: (accessToken: string) => {
      try {
        const decoded = jwtDecode<{ userId: number }>(accessToken);
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        set({ isLogin: true, userId: decoded.userId });
      } catch (err) {
        console.error("토큰 디코딩 실패:", err);
        localStorage.removeItem(ACCESS_TOKEN);
        set({ isLogin: false, userId: null });
      }
    },
    logout: () => {
      localStorage.removeItem(ACCESS_TOKEN);
      set({ isLogin: false, userId: null });
    },
  };
});