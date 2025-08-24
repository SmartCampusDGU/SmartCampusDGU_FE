import { AccountIcon } from "@/assets/icons/AccountIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";

const Header = () => {
  return (
    <div className="w-full h-[84px] flex-shrink-0 bg-[var(--white)] flex items-center px-[39px]">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center">
        <img
          src="/logos/DGU_ENG.png"
          alt="동국대학교 영문 로고"
          className="w-[173px] h-[80px] flex-shrink-0 [aspect-ratio:173/80]"
        />
        <span className="ml-[15px] text-[24px] font-bold leading-none font-inter text-[var(--black)]">
          캠퍼스 안전 모니터링 시스템
        </span>
      </div>

       {/* 오른쪽: 사용자 + 로그아웃 */}
      <div className="ml-auto flex items-center gap-[40px]">
        {/* 시설 관리처 님 */}
        <div className="flex items-center">
          <AccountIcon />
          <span className="ml-[10px] w-[169px] h-[43px] text-[27px] font-medium font-inter text-[var(--black)] leading-normal flex items-center">
            시설 관리처 님
          </span>
        </div>

        {/* 로그아웃 */}
        <div className="flex items-center">
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