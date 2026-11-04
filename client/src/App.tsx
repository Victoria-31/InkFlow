import { Route, Routes } from 'react-router';
import { ArtistPage } from '@/modules/public/pages/ArtistPage';
import { NotFoundPage } from '@/modules/public/pages/NotFoundPage';
import { ProjectRequestPage } from '@/modules/public/pages/ProjectRequestPage';

export default function App() {
  return (
    <Routes>
      <Route path=":username" element={<ArtistPage />} />
      <Route path=":username/request" element={<ProjectRequestPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
