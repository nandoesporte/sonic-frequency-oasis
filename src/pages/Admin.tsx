
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { UsersManagement } from '@/pages/admin/UsersManagement';
import { SubscriptionsManagement } from '@/pages/admin/SubscriptionsManagement';
import { ContentManagement } from '@/pages/admin/ContentManagement';
import { AdminSettings } from '@/pages/admin/Settings';
import { AdminAccess } from '@/pages/admin/AdminAccess';

const Admin = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="subscriptions" element={<SubscriptionsManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="access" element={<AdminAccess />} />
        
        {/* Default route to handle direct navigation to /admin/settings */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Admin;
