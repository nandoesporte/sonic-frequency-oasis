
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { UsersManagement } from '@/pages/admin/UsersManagement';
import { SubscriptionsManagement } from '@/pages/admin/SubscriptionsManagement';
import { ContentManagement } from '@/pages/admin/ContentManagement';
import { AdminSettings } from '@/pages/admin/Settings';

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="subscriptions" element={<SubscriptionsManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default Admin;
