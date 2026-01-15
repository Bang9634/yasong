import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // 입력 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TODO: 백엔드 API 호출로 대체
    console.log('회원가입 시도:', formData);

    // 회원가입 성공 시 로그인 페이지로 이동
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-900 mb-2">회원가입</h1>
          <p className="text-gray-600">군립청송야송미술관 회원이 되어보세요</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력해주세요"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.passwordConfirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('passwordConfirm', e.target.value)}
                className={errors.passwordConfirm ? 'border-red-500' : ''}
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-red-500">{errors.passwordConfirm}</p>
              )}
            </div>

            {/* 연락처 */}
            <div className="space-y-2">
              <Label htmlFor="phone">연락처 *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked: boolean | 'indeterminate') => 
                    handleChange('agreeTerms', checked === true)
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor="agreeTerms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    이용약관에 동의합니다 (필수)
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-500 mt-1">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onCheckedChange={(checked: boolean | 'indeterminate') => 
                    handleChange('agreePrivacy', checked === true)
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor="agreePrivacy"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    개인정보 처리방침에 동의합니다 (필수)
                  </label>
                  {errors.agreePrivacy && (
                    <p className="text-sm text-red-500 mt-1">{errors.agreePrivacy}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white">
              회원가입
            </Button>

            {/* 로그인 링크 */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-teal-700 hover:text-teal-800 font-semibold">
                  로그인
                </Link>
              </p>
            </div>

            {/* 홈으로 돌아가기 */}
            <div className="text-center">
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
