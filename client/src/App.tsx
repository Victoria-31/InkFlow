import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@/modules/public/pages/NotFoundPage';
import { ProjectRequestPage } from '@/modules/public/pages/ProjectRequestPage';

export default function App() {
  return (
    <Routes>
      <Route path=":username" element={<ProjectRequestPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
