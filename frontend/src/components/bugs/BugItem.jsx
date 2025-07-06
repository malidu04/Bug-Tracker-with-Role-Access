import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'
import { BUG_STATUS, BUG_PRIORITY } from '../../utils/constants'
import RoleBadge from '../ui/RoleBadge'

const statusColors = {
  [BUG_STATUS.OPEN]: 'bg-gray-100 text-gray-800',
  [BUG_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [BUG_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
  [BUG_STATUS.CLOSED]: 'bg-purple-100 text-purple-800'
}

const priorityColors = {
  [BUG_PRIORITY.LOW]: 'bg-green-100 text-green-800',
  [BUG_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [BUG_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [BUG_PRIORITY.CRITICAL]: 'bg-red-100 text-red-800'
}

const BugItem = ({ bug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <Link to={`/bugs/${bug._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            {bug.title}
          </h3>
        </Link>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bug.status]}`}
          >
            {bug.status}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[bug.priority]}`}
          >
            {bug.priority}
          </span>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{bug.description}</p>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
            {bug.reporter.name.charAt(0)}
          </div>
          <span className="text-xs text-gray-500">{bug.reporter.name}</span>
        </div>
        
        <div className="text-xs text-gray-500">
          {formatDate(bug.createdAt)}
        </div>
      </div>
      
      {bug.assignedTo && (
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-xs text-gray-500">Assigned to:</span>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold">
              {bug.assignedTo.name.charAt(0)}
            </div>
            <span className="text-xs font-medium">{bug.assignedTo.name}</span>
            <RoleBadge role={bug.assignedTo.roles[0]} small />
          </div>
        </div>
      )}
    </div>
  )
}

export default BugItem