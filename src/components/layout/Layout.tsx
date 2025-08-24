import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--white-02)]">
      {/* 헤더 */}
      <Header />

      {/* 헤더 바로 아래, 사이드바 + 메인 영역 */}
      <div className="flex w-full">
        {/* 사이드바 */}
        <Sidebar
          onNavigate={(href) => {
            if (href) navigate(href);
          }}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-h-[calc(100vh-84px)] overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}