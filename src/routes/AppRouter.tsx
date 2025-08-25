import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from '@/pages/auth/LogIn';
import MainPage from '@/pages/main/Main';
import FacilitiesPage from '@/pages/facilities/Facilities';
import Layout from '@/components/layout/Layout'

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 (헤더 없음) */}
        <Route path="/" element={<LogInPage />} />

        {/* 헤더가 포함된 Layout */}
        <Route element={<Layout />}>
         {/* 메인 페이지 */}
          <Route path="/main" element={<MainPage />} />
           {/* 시설 관리 페이지 */}
          <Route path="/facilities" element={<FacilitiesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;