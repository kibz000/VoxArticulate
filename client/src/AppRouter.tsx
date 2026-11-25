
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom'

import App from './App'
import Navbar from './components/Navbar'
import PlaceholderPage from './pages/PlaceholderPage'

import DiscoverPage from './pages/DiscoverPage'
import LearningHubPage from './pages/LearningHubPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

import LessonPage from './pages/LessonPage'
import AssessmentsPage from './pages/AssessmentsPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ResultsPage from './pages/ResultsPage'
import CommunicationLabPage from './pages/CommunicationLabPage'

import { useAuth } from './features/authentication/AuthContext'

function SiteLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function RequireAccount() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-vox-cream">
        <p className="font-semibold text-vox-muted">
          Checking your learner account...
        </p>
      </main>
    )
  }

  if (!user) {
    const requestedPage =
      `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to={`/register?next=${encodeURIComponent(requestedPage)}`}
        replace
      />
    )
  }

  return <Outlet />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<DiscoverPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/academy" element={<LearningHubPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/courses/:courseId"
            element={<CourseDetailsPage />}
          />

          <Route element={<RequireAccount />}>
            <Route
              path="/courses/:courseId/learn"
              element={<LessonPage />}
            />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route
              path="/assessments/:assessmentId"
              element={<AssessmentsPage />}
            />
            <Route
              path="/results/:assessmentId"
              element={<ResultsPage />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/communication-lab"
              element={<CommunicationLabPage />}
            />
          </Route>

          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page Not Found"
                description="The page you requested does not exist. Return to VoxArticulate and continue exploring."
              />
            }
          />
        </Route>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/auth/callback"
          element={<AuthCallbackPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}
