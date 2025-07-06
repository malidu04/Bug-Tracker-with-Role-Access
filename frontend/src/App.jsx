import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { SocketProvider } from './context/socketContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import BugsPage from './pages/bugs/BugsPage'// Added this import
import BugDetailsPage from './pages/bugs/BugDetailsPage'
import ProfilePage from './pages/users/ProfilePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import UnauthorizedPage from './pages/errors/UnauthorizedPage'
import PrivateRoute from './components/layout/PrivateRoute'
import CreateBugPage from './pages/bugs/createBugPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                <Route element={<PrivateRoute allowedRoles={['admin', 'developer', 'tester']} />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/bugs" element={<BugsPage />} />
                  <Route path="/bugs/create" element={<CreateBugPage />} />
                  <Route path="/bugs/:id" element={<BugDetailsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App