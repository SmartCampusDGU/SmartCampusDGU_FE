import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from '@/pages/auth/LogIn'

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        {/* 이후 다른 경로 추가 가능 */}
      </Routes>
    </Router>
  );
}

export default AppRouter;