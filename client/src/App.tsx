import { Route, Routes } from 'react-router';
import { atelierRoutes } from '@/modules/atelier/routes';
import { authRoutes } from '@/modules/auth/routes';
import { clientRoutes } from '@/modules/client/routes';
import { NotFoundPage } from '@/modules/public/pages/NotFoundPage';
import { publicRoutes } from '@/modules/public/routes';

// Static paths (/login, /studio, /my-projects) win over /:username whatever the order: React Router ranks routes by specificity
export default function App() {
  return (
    <Routes>
      {authRoutes}
      {atelierRoutes}
      {clientRoutes}
      {publicRoutes}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
