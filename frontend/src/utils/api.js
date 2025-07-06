import axios from 'axios'
import { useAuth } from '../context/authContext'
import { VITE_API_BASE_URL } from './constants'

const api = axios.create({
  baseURL: VITE_API_BASE_URL
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const { logout } = useAuth()
      logout()
    }
    return Promise.reject(error)
  }
)

export default api