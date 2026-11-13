import { Route } from 'react-router';
import { RequireAuth } from '@/components/RequireAuth';
import { DashboardPage } from './pages/DashboardPage';

export const atelierRoutes = (
  <Route path="studio" element={<RequireAuth />}>
    <Route index element={<DashboardPage />} />
  </Route>
);
