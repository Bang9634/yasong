/**
 * 권한 체크 유틸리티 함수들
 */

export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export const hasRole = (userRole: string | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy: { [key: string]: number } = {
    USER: 1,
    MANAGER: 2,
    ADMIN: 3
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

/**
 * 사용자가 ADMIN 권한인지 확인
 */
export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === UserRole.ADMIN;
};

/**
 * 사용자가 MANAGER 이상 권한인지 확인
 */
export const isManagerOrAbove = (userRole: string | undefined): boolean => {
  return hasRole(userRole, UserRole.MANAGER);
};

/**
 * 권한 레벨 표시 이름
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: { [key: string]: string } = {
    USER: '일반 사용자',
    MANAGER: '관리자',
    ADMIN: '최고 관리자'
  };
  return roleNames[role] || role;
};
