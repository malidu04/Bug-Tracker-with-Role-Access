import axios from 'axios'
import { VITE_API_BASE_URL } from '../utils/constants'

const API_URL = `${VITE_API_BASE_URL}/users`

const getCurrentUser = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`)
  return response.data
}

const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData)
  return response.data
}

const getUsers = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export { getCurrentUser, updateUser, getUsers }