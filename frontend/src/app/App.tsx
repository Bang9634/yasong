import { AppRoutes } from './AppRoutes';
import { PageTracking } from './PageTracking';
import { BrowserRouter as Router } from 'react-router-dom';
import { ScrollToTop } from '@/app/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function App() {
  // Google Analytics 초기화 (한 번만 실행)
  useEffect(() => {
    ReactGA.initialize('G-LNQ8J9TSN5');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <PageTracking />
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
