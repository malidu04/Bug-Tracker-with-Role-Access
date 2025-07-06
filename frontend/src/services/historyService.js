import api from '../utils/api'

const getBugHistory = async (bugId) => {
  const response = await api.get(`/history/bug/${bugId}`)
  return response.data
}

const getUserActivity = async (userId) => {
  const response = await api.get(`/history/user/${userId}`)
  return response.data
}

export { getBugHistory, getUserActivity }