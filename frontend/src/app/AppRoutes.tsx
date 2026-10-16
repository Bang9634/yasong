import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { NoticePage } from '@/pages/notice/NoticePage';
import { NoticeDetailPage } from '@/pages/notice/NoticeDetailPage';
import { NoticeEditorPage } from '@/pages/notice/NoticeEditorPage';
import { ExhibitionsPage } from '@/pages/exhibition/ExhibitionsPage';
import { ExhibitionDetailPage } from '@/pages/exhibition/ExhibitionDetailPage';
import { ExhibitionEditorPage } from '@/pages/exhibition/ExhibitionEditorPage';
import { ContestsPage } from '@/pages/contest/ContestsPage';
import { ContestDetailPage } from '@/pages/contest/ContestDetailPage';
import { ContestEditorPage } from '@/pages/contest/ContestEditorPage';
import { CollectionsPage } from '@/pages/collection/CollectionsPage';
import { CollectionDetailPage } from '@/pages/collection/CollectionDetailPage';
import { CollectionEditorPage } from '@/pages/collection/CollectionEditorPage';
import { StoryPage } from '@/pages/story/StoryPage';
import { BiographyPage } from '@/pages/story/BiographyPage';
import { PhotoPage } from '@/pages/photo/PhotoPage';
import { PhotoDetailPage } from '@/pages/photo/PhotoDetailPage';
import { PhotoEditorPage } from '@/pages/photo/PhotoEditorPage';
import { LegalTermDetailPage } from '@/pages/legal/LegalTermDetailPage';
import { LegalTermHistoryPage } from '@/pages/legal/LegalTermHistoryPage';
import { LegalTermManagementPage } from '@/pages/legal/LegalTermManagementPage';
import { LegalTermEditorPage } from '@/pages/legal/LegalTermEditorPage';
import { UpdateLogsPage } from '@/pages/update-log/UpdateLogsPage';
import { UpdateLogDetailPage } from '@/pages/update-log/UpdateLogDetailPage';
import { UpdateLogEditorPage } from '@/pages/update-log/UpdateLogEditorPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { UserManagementPage } from '@/pages/user/UserManagementPage';
import { WebsiteManagementPage } from '@/pages/website/WebsiteManagementPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/story" element={<StoryPage />} />
      <Route path="/biography" element={<BiographyPage />} />
      <Route path="/notice" element={<NoticePage />} />
      <Route path="/notice/:id" element={<NoticeDetailPage />} />
      <Route path="/notice/write" element={<NoticeEditorPage />} />
      <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
      <Route path="/exhibitions/write" element={<ExhibitionEditorPage />} />
      <Route path="/exhibitions/edit/:id" element={<ExhibitionEditorPage />} />
      <Route path="/contests" element={<ContestsPage />} />
      <Route path="/contests/:id" element={<ContestDetailPage />} />
      <Route path="/contests/write" element={<ContestEditorPage />} />
      <Route path="/contests/edit/:id" element={<ContestEditorPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:id" element={<CollectionDetailPage />} />
      <Route path="/admin/collections/new" element={<CollectionEditorPage />} />
      <Route path="/admin/collections/edit/:id" element={<CollectionEditorPage />} />

      {/* 사진 자료 */}
      <Route path="/photos" element={<PhotoPage />} />
      <Route path="/photos/:id" element={<PhotoDetailPage />} />
      <Route path="/photos/write" element={<PhotoEditorPage />} />
      <Route path="/photos/edit/:id" element={<PhotoEditorPage />} />

      {/* 이용약관 & 개인정보 처리방침 */}
      <Route path="/legal/:type" element={<LegalTermDetailPage />} />
      <Route path="/legal/detail/:id" element={<LegalTermDetailPage />} />
      <Route path="/legal/:type/history" element={<LegalTermHistoryPage />} />

      {/* 업데이트 내역 */}
      <Route path="/updates" element={<UpdateLogsPage />} />
      <Route path="/updates/:id" element={<UpdateLogDetailPage />} />
      <Route path="/updates/write" element={<UpdateLogEditorPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      {/* 관리자 페이지 */}
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/website" element={<WebsiteManagementPage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="/admin/legal" element={<LegalTermManagementPage />} />
      <Route path="/admin/legal/new" element={<LegalTermEditorPage />} />
      <Route path="/admin/legal/edit/:id" element={<LegalTermEditorPage />} />
    </Routes>
  );
}
