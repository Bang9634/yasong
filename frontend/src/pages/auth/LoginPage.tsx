import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, User, LogOut, Home, CheckCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 기본 유효성 검사
    if (!username || !password) {
      const errorMsg = '아이디와 비밀번호를 입력해주세요.';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    try {
      const response = await login(username, password);
      console.log('로그인 성공:', response);
      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      // 백엔드에서 보낸 에러 메시지 추출
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      alert(`로그인 실패\n\n${errorMessage}`);
      console.error('로그인 실패:', err);
    }
  };

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
  };

  // 이미 로그인된 경우
  if (user) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* 헤더 */}
          <div className="text-center mb-8">
            {/* 체크 아이콘 */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">이미 로그인되어 있습니다</h1>
            <p className="text-[#2C2C2C]/60">
              {user.username}님으로 로그인 중입니다
            </p>
          </div>

          {/* 정보 카드 */}
          <div className="bg-white border-2 border-[#2C2C2C]/10 rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              {/* 사용자 정보 */}
              <div className="bg-[#F4F4F0] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/60">
                  <User className="w-4 h-4" />
                  <span>사용자명</span>
                </div>
                <p className="text-lg font-medium text-[#2C2C2C]">{user.username}</p>
              </div>

              {/* 역할 정보 */}
              <div className="bg-[#F4F4F0] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/60">
                  <Shield className="w-4 h-4" />
                  <span>권한</span>
                </div>
                <p className="text-lg font-medium text-[#2C2C2C]">
                  {user.role === 'ADMIN' ? '최고 관리자' : 
                   user.role === 'MANAGER' ? '관리자' : '일반 사용자'}
                </p>
              </div>

              {/* 버튼 그룹 */}
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full bg-[#C84630] hover:bg-[#C84630]/90 text-white font-medium py-6 text-base transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  홈페이지로 이동
                </Button>

                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5 font-medium py-6 text-base transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>

          {/* 하단 안내 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#2C2C2C]/40">
              다른 계정으로 로그인하려면 먼저 로그아웃하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          {/* 관리자 아이콘 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C84630] rounded-full mb-4">
            <Shield className="w-10 h-10 text-[#F4F4F0]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">관리자 로그인</h1>
          <p className="text-[#2C2C2C]/60">야송 홈페이지 관리 시스템</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white border-2 border-[#2C2C2C]/10 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-[#C84630]/10 border border-[#C84630] text-[#C84630] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 아이디 */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#2C2C2C] font-medium">아이디</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2C2C]/40" />
                <Input
                  id="username"
                  type="text"
                  placeholder="관리자 아이디를 입력해주세요"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="w-full pl-10 border-[#2C2C2C]/20 focus:border-[#C84630] focus:ring-[#C84630] text-[#2C2C2C]"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2C2C2C] font-medium">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2C2C]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full pl-10 border-[#2C2C2C]/20 focus:border-[#C84630] focus:ring-[#C84630] text-[#2C2C2C]"
                />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <Button 
              type="submit" 
              className="w-full bg-[#C84630] hover:bg-[#C84630]/90 text-white font-medium py-6 text-base transition-colors"
            >
              관리자 로그인
            </Button>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2C2C2C]/10"></div>
              </div>
            </div>

            {/* 홈으로 돌아가기 */}
            <div className="text-center pt-4">
              <Link 
                to="/" 
                className="text-sm text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors inline-flex items-center gap-1"
              >
                ← 홈으로 돌아가기
              </Link>
            </div>
          </form>
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#2C2C2C]/40">
            관리자 계정이 필요한 경우 시스템 관리자에게 문의하세요
          </p>
        </div>
      </div>
    </div>
  );
}
