import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/utils/api';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  
  // 상세 사용자 정보
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  
  // 사용자 정보 수정
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // 비밀번호 변경
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // 회원 탈퇴
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    // 로딩 중에는 리다이렉트하지 않음
    if (loading) return;
    
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/');
    } else {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      
      // 상세 사용자 정보 조회
      const fetchUserDetails = async () => {
        try {
          setIsLoadingDetails(true);
          const data = await usersAPI.me();
          setUserDetails(data);
        } catch (err) {
          console.error('사용자 정보 조회 실패:', err);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      
      fetchUserDetails();
    }
  }, [user, navigate, loading]);

  // 프로필 정보 수정
  const handleProfileChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
    if (profileErrors[field]) {
      setProfileErrors({ ...profileErrors, [field]: '' });
    }
  };

  const validateProfile = () => {
    const errors: { [key: string]: string } = {};

    if (!profileData.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    }

    if (!profileData.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setIsProfileLoading(true);
    try {
      await usersAPI.updateProfile(profileData);
      alert('프로필이 수정되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필 수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: '' });
    }
  };

  const validatePassword = () => {
    const errors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      errors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다.';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsPasswordLoading(true);
    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('비밀번호가 변경되었습니다.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까?\n\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.'
    );

    if (!confirmed) return;

    setIsDeleteLoading(true);
    try {
      await usersAPI.deleteAccount(deletePassword);
      alert('회원 탈퇴가 완료되었습니다.');
      logout();
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원 탈퇴에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (!user) {
    return null; // 로그인 안 된 경우 useEffect에서 리다이렉트됨
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">내정보</h1>
            <p className="text-gray-600">프로필 정보를 관리하고 계정 설정을 변경할 수 있습니다.</p>
          </div>

          {/* 사용자 상세 정보 */}
          {isLoadingDetails ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-500">정보를 불러오는 중...</p>
            </div>
          ) : userDetails && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">계정 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">사용자 ID</p>
                  <p className="text-lg font-semibold">{userDetails.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">권한</p>
                  <p className="text-lg font-semibold">{userDetails.role || '일반 사용자'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">가입일</p>
                  <p className="text-lg font-semibold">
                    {userDetails.createdAt ? new Date(userDetails.createdAt).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* 프로필 정보 수정 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 정보</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleProfileChange('name', e.target.value)
                    }
                    className={profileErrors.name ? 'border-red-500' : ''}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">{profileErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleProfileChange('email', e.target.value)
                    }
                    className={profileErrors.email ? 'border-red-500' : ''}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-red-500">{profileErrors.email}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                  disabled={isProfileLoading}
                >
                  {isProfileLoading ? '저장 중...' : '프로필 저장'}
                </Button>
              </form>
            </div>

            {/* 비밀번호 변경 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">비밀번호 변경</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호 *</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePasswordChange('currentPassword', e.target.value)
                    }
                    className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호 *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="8자 이상 입력해주세요"
                    value={passwordData.newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePasswordChange('newPassword', e.target.value)
                    }
                    className={passwordErrors.newPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPasswordConfirm">새 비밀번호 확인 *</Label>
                  <Input
                    id="newPasswordConfirm"
                    type="password"
                    placeholder="새 비밀번호를 다시 입력해주세요"
                    value={passwordData.newPasswordConfirm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePasswordChange('newPasswordConfirm', e.target.value)
                    }
                    className={passwordErrors.newPasswordConfirm ? 'border-red-500' : ''}
                  />
                  {passwordErrors.newPasswordConfirm && (
                    <p className="text-sm text-red-500">{passwordErrors.newPasswordConfirm}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </form>
            </div>

            {/* 회원 탈퇴 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-red-700 mb-4">회원 탈퇴</h2>
              <p className="text-gray-600 mb-6">
                회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deletePassword">비밀번호 확인 *</Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={deletePassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setDeletePassword(e.target.value)
                    }
                  />
                </div>

                <Button 
                  type="button"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? '처리 중...' : '회원 탈퇴'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
