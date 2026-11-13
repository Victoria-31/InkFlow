import { Route } from 'react-router';
import { RequireAuth } from '@/components/RequireAuth';
import { ArtistLayout } from './components/ArtistLayout';
import { DashboardPage } from './pages/DashboardPage';
import { NoRequestSelected } from './pages/NoRequestSelected';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { RequestsPage } from './pages/RequestsPage';

export const atelierRoutes = (
  <Route path="artist" element={<RequireAuth role="ARTIST" />}>
    <Route element={<ArtistLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="requests" element={<RequestsPage />}>
        <Route index element={<NoRequestSelected />} />
        <Route path=":id" element={<RequestDetailPage />} />
      </Route>
    </Route>
  </Route>
);
