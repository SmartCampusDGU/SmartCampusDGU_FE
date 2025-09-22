import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Inquiry from '@/components/auth/Inquiry';
import LogIn from '@/components/auth/LogIn';
import { logIn } from '@/apis/auth/auth';
import { useLoginStore } from '@/state/store/loginStore';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [password, setPassword] = useState('');
  const login = useLoginStore((state) => state.login);
  const navigate = useNavigate(); 

  useEffect(() => {
  const savedId = localStorage.getItem('rememberedId');
  if (savedId) {
    setUsername(savedId);
    setRememberId(true);
  }
}, []);

  const handleLogin = async () => {
    try {
      const accessToken = await logIn({ username, password });
      login(accessToken);
      if (rememberId) {
      localStorage.setItem('rememberedId', username);
    } else {
      localStorage.removeItem('rememberedId');
    }
      console.log('로그인 성공');
      navigate('/main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--white-02)]">
      {/* 로고 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[178px]">
        <img
          src="/logos/DGU_KOR.png"
          alt="동국대학교 로고"
          className="w-[381px] h-[177px] flex-shrink-0 [aspect-ratio:127/59]"
        />
      </div>

      {/* 캠퍼스 안전 모니터링 시스템*/}
      <div className="absolute top-[355px] left-1/2 -translate-x-1/2 w-[491px] text-[40px] text-black font-medium text-center font-inter leading-normal">
        캠퍼스 안전 모니터링 시스템
      </div>

      {/* 아이디 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[445px]">
        <Inquiry label="아이디" value={username} onChange={setUsername} />
      </div>

      {/* 비밀번호 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[541px]">
        <Inquiry
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>

      {/* 아이디 기억 체크박스 */}
<div className="absolute left-1/2 -translate-x-1/2 top-[622px] w-[525px]">
  <div className="flex justify-end items-center text-black font-inter text-sm">
    <input
      id="rememberId"
      type="checkbox"
      className="w-4 h-4 mr-2 accent-[var(--orange)]"
    />
   <input
  id="rememberId"
  type="checkbox"
  className="w-4 h-4 mr-2 accent-[var(--orange)]"
  checked={rememberId}
  onChange={(e) => setRememberId(e.target.checked)}
/>
  </div>
</div>

      {/* 로그인 버튼 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[687px]">
        <LogIn onClick={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;