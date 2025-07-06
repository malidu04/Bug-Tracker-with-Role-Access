import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBug } from '../../services/bugsService'
import BugForm from '../../components/bugs/BugForm'
import Alert from '../../components/ui/Alert'

const CreateBugPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (bugData) => {
    try {
      setLoading(true)
      const newBug = await createBug(bugData)
      navigate(`/bugs/${newBug._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Bug</h1>
        </div>
        
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <BugForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBugPage