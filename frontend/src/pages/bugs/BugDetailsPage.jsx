import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { getBugById, updateBug } from '../../services/bugsService'
import { getCommentsByBugId, createComment } from '../../services/commentsService'
import BugForm from '../../components/bugs/BugForm'
import CommentForm from '../../components/comments/CommentForm'
import CommentItem from '../../components/comments/CommentItem'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../utils/helpers'
import RoleBadge from '../../components/ui/RoleBadge'

const BugDetailsPage = () => {
  const { id } = useParams()
  const [bug, setBug] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentLoading, setCommentLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchBugAndComments = async () => {
      try {
        setLoading(true)
        const [bugData, commentsData] = await Promise.all([
          getBugById(id),
          getCommentsByBugId(id)
        ])
        setBug(bugData)
        setComments(commentsData)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bug details')
      } finally {
        setLoading(false)
      }
    }

    fetchBugAndComments()
  }, [id])

  const handleBugUpdate = async (updatedData) => {
    try {
      setLoading(true)
      const updatedBug = await updateBug(id, updatedData)
      setBug(updatedBug)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bug')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (commentData) => {
    try {
      setCommentLoading(true)
      const newComment = await createComment({
        ...commentData,
        bug: id
      })
      setComments([newComment, ...comments])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading && !bug) {
    return <Loader size="lg" className="py-12" />
  }

  if (!bug) {
    return <div className="py-12 text-center text-gray-500">Bug not found</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              {bug.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created on {formatDate(bug.createdAt)} by {bug.reporter.name}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {bug.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {bug.status}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {bug.priority}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                  {bug.assignedTo ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold">
                        {bug.assignedTo.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {bug.assignedTo.name}
                      </span>
                      <RoleBadge role={bug.assignedTo.roles[0]} small />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Unassigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(user.roles.includes('admin') || user._id === bug.reporter._id) && (
          <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Bug</h2>
              <BugForm
                initialData={{
                  title: bug.title,
                  description: bug.description,
                  priority: bug.priority,
                  status: bug.status
                }}
                onSubmit={handleBugUpdate}
                loading={loading}
              />
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
            <CommentForm onSubmit={handleCommentSubmit} loading={commentLoading} />
            
            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
              
              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BugDetailsPage