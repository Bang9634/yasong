import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 임시 로그인 로직 (추후 백엔드 API 연동 예정)
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // TODO: 백엔드 API 호출로 대체
    console.log('로그인 시도:', { email, password });
    
    // 임시로 홈으로 이동
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-900 mb-2">로그인</h1>
          <p className="text-gray-600">군립청송야송미술관에 오신 것을 환영합니다</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 비밀번호 찾기 */}
            <div className="text-right">
              <Link to="#" className="text-sm text-teal-700 hover:text-teal-800">
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white">
              로그인
            </Button>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link to="/signup" className="text-teal-700 hover:text-teal-800 font-semibold">
                  회원가입
                </Link>
              </p>
            </div>

            {/* 홈으로 돌아가기 */}
            <div className="text-center pt-4">
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← 홈으로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
