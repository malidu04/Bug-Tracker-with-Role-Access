import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './authContext'
import { VITE_API_BASE_URL } from '../utils/constants'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (token && !socket) {
      const newSocket = io(VITE_API_BASE_URL, {
        auth: { token }
      })

      setSocket(newSocket)

      newSocket.on('connect', () => {
        console.log('Connected to socket server')
      })

      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev])
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server')
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [token])

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        clearNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)