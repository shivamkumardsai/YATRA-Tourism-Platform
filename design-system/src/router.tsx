import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { JourneyPlannerPage } from './pages/JourneyPlannerPage'
import { ExperiencesPage } from './pages/ExperiencesPage'
import { LocalTreasuresPage } from './pages/LocalTreasuresPage'
import { ConservationWatchPage } from './pages/ConservationWatchPage'
import { TourismIntelligenceCentrePage } from './pages/TourismIntelligenceCentrePage'
import { LoginPage } from './pages/LoginPage'
import { ErrorBoundary } from './ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'journey-planner', element: <JourneyPlannerPage /> },
      { path: 'experiences', element: <ExperiencesPage /> },
      { path: 'local-treasures', element: <LocalTreasuresPage /> },
      { path: 'conservation-watch', element: <ConservationWatchPage /> },
      { path: 'tourism-intelligence-centre', element: <TourismIntelligenceCentrePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
])
