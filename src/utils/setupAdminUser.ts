
import { addAdminUser } from '@/contexts/admin-utils';

export const setupAdminUser = async () => {
  try {
    // Add the specified user as admin
    const email = 'nandomartin21@msn.com';
    const result = await addAdminUser(email);
    
    if (result.success) {
      console.log(`User ${email} has been granted admin access.`);
    } else {
      console.error(`Failed to grant admin access to ${email}:`, result.error);
    }
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
};
