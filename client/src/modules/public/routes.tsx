import { Route } from 'react-router';
import { ArtistPage } from './pages/ArtistPage';
import { ProjectRequestPage } from './pages/ProjectRequestPage';

export const publicRoutes = (
  <>
    <Route path=":username" element={<ArtistPage />} />
    <Route path=":username/request" element={<ProjectRequestPage />} />
  </>
);
