import axios from 'axios'
import { VITE_API_BASE_URL } from '../utils/constants'

const API_URL = `${VITE_API_BASE_URL}/bugs`

const getBugs = async (filters = {}) => {
  const response = await axios.get(API_URL, { params: filters })
  return response.data
}

const getBugById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

const createBug = async (bugData) => {
  const response = await axios.post(API_URL, bugData)
  return response.data
}

const updateBug = async (id, bugData) => {
  const response = await axios.put(`${API_URL}/${id}`, bugData)
  return response.data
}

const deleteBug = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export { getBugs, getBugById, createBug, updateBug, deleteBug }