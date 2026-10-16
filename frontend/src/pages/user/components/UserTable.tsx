import type { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getRoleDisplayName } from '@/utils/auth';
import type { useUserManagement } from '../hooks/useUserManagement';

type UserTableProps = Pick<
  ReturnType<typeof useUserManagement>,
  'isLoading' | 'filteredUsers' | 'setSelectedUser' | 'setNewRole' | 'handleDeleteUser'
> & {
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
};

export function UserTable({
  isLoading,
  filteredUsers,
  setSelectedUser,
  setNewRole,
  user,
  handleDeleteUser,
}: UserTableProps) {
  return (
    <>
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
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800'
                            : u.role === 'MANAGER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
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
    </>
  );
}
