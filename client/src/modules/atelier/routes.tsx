import { Route } from 'react-router';
import { RequireAuth } from '@/components/RequireAuth';
import { DashboardPage } from './pages/DashboardPage';

export const atelierRoutes = (
  <Route path="artist" element={<RequireAuth role="ARTIST" />}>
    <Route index element={<DashboardPage />} />
  </Route>
);
