import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { useUserManagement } from '../hooks/useUserManagement';

type UserFiltersProps = Pick<
  ReturnType<typeof useUserManagement>,
  'searchTerm' | 'setSearchTerm' | 'roleFilter' | 'setRoleFilter'
>;

export function UserFilters({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
}: UserFiltersProps) {
  return (
    <>
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
              className="inline-flex items-center justify-between min-w-[150px] px-4 py-2 text-sm font-medium text-[#2C2C2C] bg-white border border-[#2C2C2C]/20 rounded-md hover:bg-[#F4F4F0] focus:outline-none focus:ring-2 focus:ring-[#C84630]"
            >
              {roleFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuItem onClick={() => setRoleFilter('전체')}>전체</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('최고 관리자')}>
              최고 관리자
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('관리자')}>관리자</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('일반 사용자')}>
              일반 사용자
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
