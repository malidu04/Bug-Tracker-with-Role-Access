import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { loginUser, registerUser, logoutUser } from '../services/authService'
import { getCurrentUser } from '../services/userService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token)
          const currentUser = await getCurrentUser(decoded.userId)
          setUser(currentUser)
        }
      } catch (err) {
        console.error('Authentication initialization error:', err)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [token])

  const login = async (credentials) => {
    try {
      const { token: authToken, user: authUser } = await loginUser(credentials)
      localStorage.setItem('token', authToken)
      setToken(authToken)
      setUser(authUser)
      setError(null)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const register = async (userData) => {
    try {
      const { token: authToken, user: authUser } = await registerUser(userData)
      localStorage.setItem('token', authToken)
      setToken(authToken)
      setUser(authUser)
      setError(null)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const logout = () => {
    logoutUser()
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const isAuthenticated = !!user
  const hasRole = (role) => user?.roles?.includes(role)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)