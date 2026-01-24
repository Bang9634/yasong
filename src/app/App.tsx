import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/components/HomePage';
import { Login } from '@/app/components/Login';
import { Signup } from '@/app/components/Signup';
import { NoticePage } from '@/app/components/NoticePage';
import { NoticeForm } from '@/app/components/NoticeForm';
import { ExhibitionsPage } from '@/app/components/ExhibitionsPage';
import { Profile } from '@/app/components/Profile';
import { UserManagement } from '@/app/components/admin/UserManagement';
import { WebsiteManagement } from '@/app/components/admin/WebsiteManagement';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 관리자 페이지 */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/website" element={<WebsiteManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
