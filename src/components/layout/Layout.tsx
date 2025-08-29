import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Sidebar from "./Sidebar";
import { usePageTitle } from "@/hooks/common/usePageTitle";
import { useContext } from "react";
import { ActiveNavContext } from "@/contexts/ActiveNavContext";

export default function Layout() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const activeNav = useContext(ActiveNavContext); 

  return (
    <div className="min-h-screen flex flex-col bg-white-02">
      {/* 헤더 */}
      <Header />

      {/* 헤더 바로 아래, 사이드바 + 메인 영역 */}
      <div className="flex w-full">
        {/* 사이드바 */}
       <Sidebar
          className="relative"
          activeGroupKey={activeNav?.group}
          activeItemKey={activeNav?.item}
          onNavigate={(href, g, i) => {
            // 클릭 시 활성키 갱신
            activeNav?.setActiveNav({ group: g, item: i });
            if (href) navigate(href);
          }}
        />

        {/* 메인 콘텐츠 */}
        <main className="relative z-0 flex-1 min-h-[calc(100vh-84px)] overflow-auto p-6">
           {/* 페이지 제목 */}
          {pageTitle && (
            <h1
              className="text-[30px] font-extrabold text-left text-black"
              style={{ fontFamily: "Inter" }}
            >
              {pageTitle}
            </h1>
          )}

          {/* 구분선 */}
           <div className="h-[1px] bg-[var(--gray)] w-full mt-4 max-lg:p-0 max-lg:mb-10" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}