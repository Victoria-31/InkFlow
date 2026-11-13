import { Route, Routes } from 'react-router';
import { atelierRoutes } from '@/modules/atelier/routes';
import { authRoutes } from '@/modules/auth/routes';
import { NotFoundPage } from '@/modules/public/pages/NotFoundPage';
import { publicRoutes } from '@/modules/public/routes';

// Static paths (/login, /studio) win over /:username whatever the order: React Router ranks routes by specificity
export default function App() {
  return (
    <Routes>
      {authRoutes}
      {atelierRoutes}
      {publicRoutes}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
