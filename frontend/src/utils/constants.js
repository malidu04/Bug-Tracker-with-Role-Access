export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const VITE_APP_NAME = import.meta.env.VITE_APP_NAME

export const BUG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

export const BUG_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800',
  developer: 'bg-blue-100 text-blue-800',
  tester: 'bg-green-100 text-green-800'
}