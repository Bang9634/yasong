import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/components/HomePage';
import { Login } from '@/app/components/Login';
import { Signup } from '@/app/components/Signup';
import { NoticePage } from '@/app/components/NoticePage';
import { Profile } from '@/app/components/Profile';
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
