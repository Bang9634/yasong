import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { CreateUserDialog } from './components/CreateUserDialog';
import { ChangeRoleDialog } from './components/ChangeRoleDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/auth';

export function UserManagementPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    selectedUser,
    setSelectedUser,
    newRole,
    setNewRole,
    showAddUserModal,
    setShowAddUserModal,
    newUser,
    setNewUser,
    handleDeleteUser,
    handleUpdateRole,
    handleAddUser,
    filteredUsers,
  } = useUserManagement(!!user && isAdmin(user.role));

  // 권한 확인
  useEffect(() => {
    if (loading) return;

    if (!user || !isAdmin(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user || !isAdmin(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">사용자 관리</h1>
              <p className="text-[#2C2C2C]/70">
                전체 사용자 계정을 관리하고 권한을 수정할 수 있습니다.
              </p>
              <p className="text-[#2C2C2C]/70">
                {' '}
                * 기본으로 생성되는 admin 계정은 사용하지 않는 것을 권장합니다.
              </p>
            </div>
            <Button
              onClick={() => setShowAddUserModal(true)}
              className="bg-[#C84630] hover:bg-[#A83820]"
            >
              <Plus className="w-4 h-4 mr-2" />
              사용자 추가
            </Button>
          </div>
          {/* 검색 및 필터 */}
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />{' '}
          {/* 사용자 목록 */}
          <UserTable
            isLoading={isLoading}
            filteredUsers={filteredUsers}
            setSelectedUser={setSelectedUser}
            setNewRole={setNewRole}
            user={user}
            handleDeleteUser={handleDeleteUser}
          />{' '}
          {/* 권한 변경 다이얼로그 */}
          <ChangeRoleDialog
            selectedUser={selectedUser}
            newRole={newRole}
            setNewRole={setNewRole}
            handleUpdateRole={handleUpdateRole}
            setSelectedUser={setSelectedUser}
          />
          {/* 사용자 추가 모달 */}
          <CreateUserDialog
            showAddUserModal={showAddUserModal}
            newUser={newUser}
            setNewUser={setNewUser}
            handleAddUser={handleAddUser}
            setShowAddUserModal={setShowAddUserModal}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
