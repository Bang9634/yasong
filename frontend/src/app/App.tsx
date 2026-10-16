import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/components/HomePage';
import { Login } from '@/app/components/Login';
import { NoticePage } from '@/app/components/NoticePage';
import { NoticeDetailPage } from '@/app/components/NoticeDetailPage';
import { NoticeForm } from '@/app/components/NoticeForm';
import { ExhibitionsPage } from '@/app/components/ExhibitionsPage';
import { ExhibitionDetail } from '@/app/components/ExhibitionDetail';
import { ExhibitionForm } from '@/app/components/ExhibitionForm';
import { ContestsPage } from '@/app/components/ContestsPage';
import { ContestDetail } from '@/app/components/ContestDetail';
import { ContestForm } from '@/app/components/ContestForm';
import { CollectionsPage } from '@/app/components/CollectionsPage';
import { CollectionDetail } from '@/app/components/CollectionDetail';
import { CollectionForm } from '@/app/components/CollectionForm';
import { StoryPage } from '@/app/components/StoryPage';
import { BiographyPage } from '@/app/components/BiographyPage';
import { PhotoPage } from '@/app/components/PhotoPage';
import { PhotoDetail } from '@/app/components/PhotoDetail';
import { PhotoForm } from '@/app/components/PhotoForm';
import { LegalTermDetail } from '@/app/components/LegalTermDetail';
import { LegalTermHistory } from '@/app/components/LegalTermHistory';
import { LegalTermManagement } from '@/app/components/admin/LegalTermManagement';
import { LegalTermForm } from '@/app/components/admin/LegalTermForm';
import { UpdateLogsPage } from '@/app/components/UpdateLogsPage';
import { UpdateLogDetail } from '@/app/components/UpdateLogDetail';
import { UpdateLogForm } from '@/app/components/UpdateLogForm';
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
          <Route path="/story" element={<StoryPage />} />
          <Route path="/biography" element={<BiographyPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetailPage />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
          <Route path="/exhibitions/write" element={<ExhibitionForm />} />
          <Route path="/exhibitions/edit/:id" element={<ExhibitionForm />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/contests/:id" element={<ContestDetail />} />
          <Route path="/contests/write" element={<ContestForm />} />
          <Route path="/contests/edit/:id" element={<ContestForm />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/admin/collections/new" element={<CollectionForm />} />
          <Route path="/admin/collections/edit/:id" element={<CollectionForm />} />
          
          {/* 사진 자료 */}
          <Route path="/photos" element={<PhotoPage />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/photos/write" element={<PhotoForm />} />
          <Route path="/photos/edit/:id" element={<PhotoForm />} />
          
          {/* 이용약관 & 개인정보 처리방침 */}
          <Route path="/legal/:type" element={<LegalTermDetail />} />
          <Route path="/legal/detail/:id" element={<LegalTermDetail />} />
          <Route path="/legal/:type/history" element={<LegalTermHistory />} />
          
          {/* 업데이트 내역 */}
          <Route path="/updates" element={<UpdateLogsPage />} />
          <Route path="/updates/:id" element={<UpdateLogDetail />} />
          <Route path="/updates/write" element={<UpdateLogForm />} />
          
          <Route path="/profile" element={<Profile />} />
          
          {/* 관리자 페이지 */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/website" element={<WebsiteManagement />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/legal" element={<LegalTermManagement />} />
          <Route path="/admin/legal/new" element={<LegalTermForm />} />
          <Route path="/admin/legal/edit/:id" element={<LegalTermForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
