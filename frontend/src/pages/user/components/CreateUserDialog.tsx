import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { useUserManagement } from '../hooks/useUserManagement';

type CreateUserDialogProps = Pick<
  ReturnType<typeof useUserManagement>,
  'showAddUserModal' | 'newUser' | 'setNewUser' | 'handleAddUser' | 'setShowAddUserModal'
>;

export function CreateUserDialog({
  showAddUserModal,
  newUser,
  setNewUser,
  handleAddUser,
  setShowAddUserModal,
}: CreateUserDialogProps) {
  return (
    <>
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
                    role: 'USER',
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
    </>
  );
}
