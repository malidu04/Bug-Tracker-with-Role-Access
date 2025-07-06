import axios from 'axios'
import { VITE_API_BASE_URL } from '../utils/constants'

const API_URL = `${VITE_API_BASE_URL}/notifications`

const getNotifications = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

const markAsRead = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/read`)
  return response.data
}

const markAllAsRead = async () => {
  const response = await axios.patch(`${API_URL}/mark-all-read`)
  return response.data
}

export { getNotifications, markAsRead, markAllAsRead }