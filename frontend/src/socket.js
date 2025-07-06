import { io } from 'socket.io-client'
import { VITE_API_BASE_URL } from './utils/constants'

const socket = io(VITE_API_BASE_URL, {
  autoConnect: false
})

export default socket