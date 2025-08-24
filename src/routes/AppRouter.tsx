import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from '@/pages/auth/LogIn';
import MainPage from '@/pages/main/Main';
import Layout from '@/components/layout/Layout'

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 (헤더 없음) */}
        <Route path="/" element={<LogInPage />} />

        {/* 헤더가 포함된 Layout */}
        <Route element={<Layout />}>
          <Route path="/main" element={<MainPage />} />
          {/* 다른 페이지들 추가 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;