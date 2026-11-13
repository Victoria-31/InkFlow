import { Route } from 'react-router';
import { RequireAuth } from '@/components/RequireAuth';
import { MyProjectsPage } from './pages/MyProjectsPage';

export const clientRoutes = (
  <Route path="my-projects" element={<RequireAuth role="CLIENT" />}>
    <Route index element={<MyProjectsPage />} />
  </Route>
);
