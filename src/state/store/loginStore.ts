import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN = 'accessToken';

interface DecodedToken {
  id: number;
  username: string;
  name: string;
}

interface ILoginState {
  isLogin: boolean;
  user: DecodedToken | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useLoginStore = create<ILoginState>((set) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  let decoded: DecodedToken | null = null;

  if (token) {
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch {
      decoded = null;
      localStorage.removeItem(ACCESS_TOKEN);
    }
  }

  return {
    isLogin: !!token && !!decoded,
    user: decoded,
    login: (accessToken: string) => {
      try {
        const userData = jwtDecode<DecodedToken>(accessToken);
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        set({ isLogin: true, user: userData });
      } catch (err) {
        console.error('토큰 디코딩 실패:', err);
        localStorage.removeItem(ACCESS_TOKEN);
        set({ isLogin: false, user: null });
      }
    },
    logout: () => {
      localStorage.removeItem(ACCESS_TOKEN);
      set({ isLogin: false, user: null });
    },
  };
});