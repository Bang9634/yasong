import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/components/HomePage';
import { Login } from '@/app/components/Login';
import { NoticePage } from '@/app/components/NoticePage';
import { NoticeDetailPage } from '@/app/components/NoticeDetailPage';
import { NoticeForm } from '@/app/components/NoticeForm';
import { ExhibitionsPage } from '@/app/components/ExhibitionsPage';
import { CollectionsPage } from '@/app/components/CollectionsPage';
import { CollectionDetail } from '@/app/components/CollectionDetail';
import { CollectionForm } from '@/app/components/CollectionForm';
import { SouvenirsPage } from '@/app/components/SouvenirsPage';
import { Profile } from '@/app/components/Profile';
import { UserManagement } from '@/app/components/admin/UserManagement';
import { WebsiteManagement } from '@/app/components/admin/WebsiteManagement';
import { AnalyticsPage } from '@/app/components/admin/AnalyticsPage';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from 'react-ga4'

// Google Analytics 추적을 위한 컴포넌트
function GoogleAnalytics() {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  
  return null;
}

export default function App() {
  // Google Analytics 초기화 (한 번만 실행)
  useEffect(() => {
    ReactGA.initialize("G-LNQ8J9TSN5");
  }, []);

  return (
    <AuthProvider>
      <Router>
        <GoogleAnalytics />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetailPage />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/admin/collections/new" element={<CollectionForm />} />
          <Route path="/admin/collections/edit/:id" element={<CollectionForm />} />
          <Route path="/souvenirs" element={<SouvenirsPage />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 관리자 페이지 */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/website" element={<WebsiteManagement />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
