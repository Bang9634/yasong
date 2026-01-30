import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { adminUsersAPI } from '@/utils/api';
import { isAdmin, getRoleDisplayName, UserRole } from '@/utils/auth';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function UserManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('전체');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'USER'
  });

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isAdmin(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // 사용자 목록 조회
  useEffect(() => {
    if (!user || !isAdmin(user.role)) return;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await adminUsersAPI.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('사용자 목록 조회 실패:', err);
        alert('사용자 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // 사용자 삭제
  const handleDeleteUser = async (id: number, username: string) => {
    const confirmed = window.confirm(
      `정말로 "${username}" 사용자를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    try {
      await adminUsersAPI.deleteUser(id);
      alert('사용자가 삭제되었습니다.');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '사용자 삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  // 권한 변경
  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await adminUsersAPI.updateUserRole(selectedUser.id, newRole);
      alert('권한이 변경되었습니다.');
      
      // 목록 업데이트
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      setSelectedUser(null);
      setNewRole('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '권한 변경에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  // 사용자 추가
  const handleAddUser = async () => {
    if (!newUser.email || !newUser.username || !newUser.password || !newUser.name) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 비밀번호 검증
    if (newUser.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    try {
      await adminUsersAPI.createUser(
        newUser.email,
        newUser.username,
        newUser.password,
        newUser.name,
      );
      alert('사용자가 추가되었습니다.');
      
      // 목록 새로고침
      const data = await adminUsersAPI.getAllUsers();
      setUsers(data);
      
      // 폼 초기화
      setNewUser({
        email: '',
        username: '',
        password: '',
        name: '',
        role: 'USER'
      });
      setShowAddUserModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '사용자 추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  // 검색 및 권한 필터링
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '전체' || 
      (roleFilter === '최고 관리자' && u.role === 'ADMIN') ||
      (roleFilter === '관리자' && u.role === 'MANAGER') ||
      (roleFilter === '일반 사용자' && u.role === 'USER');
    
    return matchesSearch && matchesRole;
  });

  if (loading || !user || !isAdmin(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-teal-900 mb-2">사용자 관리</h1>
              <p className="text-gray-600">전체 사용자 계정을 관리하고 권한을 수정할 수 있습니다.</p>
              <p className="text-gray-600"> * 기본으로 생성되는 admin 계정은 사용하지 않는 것을 권장합니다.</p>
            </div>
            <Button
              onClick={() => setShowAddUserModal(true)}
              className="bg-teal-700 hover:bg-teal-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              사용자 추가
            </Button>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-6 flex gap-4">
            <Input
              type="text"
              placeholder="이름, 이메일, 사용자명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-between min-w-[150px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {roleFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => setRoleFilter('전체')}>
                  전체
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('최고 관리자')}>
                  최고 관리자
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('관리자')}>
                  관리자
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('일반 사용자')}>
                  일반 사용자
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 사용자 목록 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">사용자가 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이메일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        권한
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가입일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            <div className="text-sm text-gray-500">@{u.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            u.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {getRoleDisplayName(u.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1"
                            disabled={u.id === user.id}
                          >
                            권한 변경
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                            disabled={u.id === user.id}
                          >
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 권한 변경 다이얼로그 */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">권한 변경</h2>
                <p className="text-gray-600 mb-4">
                  {selectedUser.name} (@{selectedUser.username})
                </p>
                
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-gray-700">새 권한</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={UserRole.USER}>일반 사용자</option>
                    <option value={UserRole.MANAGER}>관리자</option>
                    <option value={UserRole.ADMIN}>최고 관리자</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleUpdateRole}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    변경
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(null);
                      setNewRole('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 사용자 추가 모달 */}
          {showAddUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">사용자 추가</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사용자명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="8자 이상"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddUser}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    추가
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddUserModal(false);
                      setNewUser({
                        email: '',
                        username: '',
                        password: '',
                        name: '',
                        role: 'USER'
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
