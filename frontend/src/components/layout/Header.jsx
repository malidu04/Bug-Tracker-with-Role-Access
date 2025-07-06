import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import NotificationBell from '../notifications/NotificationBell'
import RoleBadge from '../ui/RoleBadge'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          BugTracker
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <NotificationBell />
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">{user.name}</div>
                    <RoleBadge role={user.roles[0]} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header