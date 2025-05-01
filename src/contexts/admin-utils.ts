
// This file has been deprecated as the admin panel has been removed
export const checkAdminStatus = async (_userId: string): Promise<boolean> => {
  return false;
};

export const getSystemStats = async () => {
  return null;
};

export const addAdminUser = async (_email: string) => {
  return { success: false, error: 'Admin functionality has been removed' };
};

export const getRecentPayments = async (_limit = 10) => {
  return [];
};

export const getSubscribedUsers = async (_limit = 10) => {
  return [];
};
