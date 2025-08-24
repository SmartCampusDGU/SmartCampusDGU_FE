import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from '@/pages/auth/LogIn'
import MainPage from '@/pages/main/Main'

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<LogInPage />} />
        
        {/* 메인 페이지 */}
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;