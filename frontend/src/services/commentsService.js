import axios from 'axios'
import { VITE_API_BASE_URL } from '../utils/constants'

const API_URL = `${VITE_API_BASE_URL}/comments`

const getCommentsByBugId = async (bugId) => {
  const response = await axios.get(`${API_URL}/bug/${bugId}`)
  return response.data
}

const createComment = async (commentData) => {
  const response = await axios.post(API_URL, commentData)
  return response.data
}

const updateComment = async (id, commentData) => {
  const response = await axios.put(`${API_URL}/${id}`, commentData)
  return response.data
}

const deleteComment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export { getCommentsByBugId, createComment, updateComment, deleteComment }