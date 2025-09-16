import { Link, useNavigate } from "react-router-dom";
import { AccountIcon } from "@/assets/icons/AccountIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { logOut } from '@/apis/auth/auth'; 
import { useLoginStore } from '@/state/store/loginStore'; 
import { useAdminAccountByIdQuery } from "@/state/queries/admin/useAdminAccountByIdQuery";

const Header = () => {
  const logout = useLoginStore((state) => state.logout);
  const userId = useLoginStore((state) => state.userId);
  const navigate = useNavigate();

  const { data: userInfo, isLoading } = useAdminAccountByIdQuery(userId ?? 0, !!userId);

  const handleLogout = async () => {
    try {
      await logOut();        
      logout();              
      navigate('/');         
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="w-full h-[84px] flex-shrink-0 bg-[var(--white)] flex items-center px-[39px]">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center">
        <Link to="/main">
          <img
            src="/logos/DGU_ENG.png"
            alt="동국대학교 영문 로고"
            className="w-[173px] h-[80px] flex-shrink-0 [aspect-ratio:173/80] cursor-pointer"
          />
        </Link>
        <span className="ml-[15px] text-[24px] font-bold leading-none font-inter text-[var(--black)]">
          캠퍼스 안전 모니터링 시스템
        </span>
      </div>

      {/* 오른쪽: 사용자 + 로그아웃 */}
      <div className="ml-auto flex items-center gap-[40px]">
        {/* 사용자 이름 */}
        <div className="flex items-center">
          <AccountIcon />
          <span className="ml-[10px] w-[169px] h-[43px] text-[27px] font-medium font-inter text-[var(--black)] leading-normal flex items-center">
            {isLoading ? "로딩 중..." : `${userInfo?.name ?? "사용자"} 님`}
          </span>
        </div>

        {/* 로그아웃 */}
        <div 
          onClick={handleLogout}
          className="flex items-center cursor-pointer"
        >
          <LogoutIcon />
          <span className="ml-[10px] w-[169px] h-[43px] text-[27px] font-medium font-inter text-[var(--black)] leading-normal flex items-center">
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;