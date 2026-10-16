import { Button } from '@/components/ui/button';
import { UserRole } from '@/utils/auth';
import type { useUserManagement } from '../hooks/useUserManagement';

type ChangeRoleDialogProps = Pick<
  ReturnType<typeof useUserManagement>,
  'selectedUser' | 'newRole' | 'setNewRole' | 'handleUpdateRole' | 'setSelectedUser'
>;

export function ChangeRoleDialog({
  selectedUser,
  newRole,
  setNewRole,
  handleUpdateRole,
  setSelectedUser,
}: ChangeRoleDialogProps) {
  return (
    <>
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
    </>
  );
}
