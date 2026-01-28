import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/components/HomePage';
import { Login } from '@/app/components/Login';
import { NoticePage } from '@/app/components/NoticePage';
import { NoticeDetailPage } from '@/app/components/NoticeDetailPage';
import { NoticeForm } from '@/app/components/NoticeForm';
import { ExhibitionsPage } from '@/app/components/ExhibitionsPage';
import { CollectionsPage } from '@/app/components/CollectionsPage';
import { SouvenirsPage } from '@/app/components/SouvenirsPage';
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
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetailPage />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/souvenirs" element={<SouvenirsPage />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 관리자 페이지 */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/website" element={<WebsiteManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
