import { useState, useEffect } from 'react';
import { adminUsersAPI } from '@/utils/api';
import type { ManagedUser } from '../types';

export function useUserManagement(enabled: boolean) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('전체');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'USER',
  });

  // 사용자 목록 조회
  useEffect(() => {
    if (!enabled) return;

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
  }, [enabled]);

  // 사용자 삭제
  const handleDeleteUser = async (id: number, username: string) => {
    const confirmed = window.confirm(
      `정말로 "${username}" 사용자를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    try {
      await adminUsersAPI.deleteUser(id);
      alert('사용자가 삭제되었습니다.');
      setUsers(users.filter((u) => u.id !== id));
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
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));

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
        newUser.name
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
        role: 'USER',
      });
      setShowAddUserModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '사용자 추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  // 검색 및 권한 필터링
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === '전체' ||
      (roleFilter === '최고 관리자' && u.role === 'ADMIN') ||
      (roleFilter === '관리자' && u.role === 'MANAGER') ||
      (roleFilter === '일반 사용자' && u.role === 'USER');

    return matchesSearch && matchesRole;
  });

  return {
    users,
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
  };
}
