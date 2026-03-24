// Client utilities
export { apiCall, getFullImageUrl, API_BASE_URL } from './client';

// API modules
export { authAPI, usersAPI, adminUsersAPI } from './auth.api';
export { noticeAPI } from './notice.api';
export { exhibitionAPI } from './exhibition.api';
export { websiteAPI } from './website.api';
export { collectionAPI } from './collection.api';
export { souvenirAPI } from './souvenir.api';
export { contestAPI } from './contest.api';
export { legalAPI } from './legal.api';
export { analyticsAPI } from './analytics.api';
export { updateLogAPI } from './updateLog.api';

// Default export for backward compatibility
export { default } from './client';
