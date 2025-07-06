import api from '../utils/api'

const API_URL = `/auth`

// Register user
export const registerUser = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData)
  return response.data
}

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post(`${API_URL}/login`, credentials)
  return response.data
}

// Logout user
export const logoutUser = () => {
  // JWT is stateless, so logout is handled client-side by removing the token
  localStorage.removeItem('token')
}

// Export all auth functions
export default {
  registerUser,
  loginUser,
  logoutUser
}