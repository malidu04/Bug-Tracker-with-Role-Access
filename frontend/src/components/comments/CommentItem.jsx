import { formatDate } from '../../utils/helpers'
import RoleBadge from '../ui/RoleBadge'

const CommentItem = ({ comment }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
            {comment.user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{comment.user.name}</div>
            <RoleBadge role={comment.user.roles[0]} small />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(comment.createdAt)}
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700">
        {comment.text}
      </div>
    </div>
  )
}

export default CommentItem