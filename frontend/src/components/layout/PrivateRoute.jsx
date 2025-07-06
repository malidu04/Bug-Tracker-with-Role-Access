import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import Loader from '../ui/Loader'
import UnauthorizedPage from '../../pages/errors/UnauthorizedPage'

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth()

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}

export default PrivateRoute