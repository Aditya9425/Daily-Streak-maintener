import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import Auth from './pages/Auth'
import EmailVerification from './pages/EmailVerification'
import LoadingSpinner from './components/LoadingSpinner'
import MainLayout from './components/layouts/MainLayout'
import HomeView from './pages/views/HomeView'
import StatsView from './pages/views/StatsView'
import HabitsView from './pages/views/HabitsView'
import ProfileView from './pages/views/ProfileView'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }
  
  return user ? children : <Navigate to="/auth" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" /> : children
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[#0B0C10] text-white">
          <Routes>
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<HomeView />} />
              <Route path="stats" element={<StatsView />} />
              <Route path="habits" element={<HabitsView />} />
              <Route path="profile" element={<ProfileView />} />
            </Route>
            <Route path="/verify" element={<EmailVerification />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App