import { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import { getBugs } from '../../services/bugsService'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import BugsList from '../../components/bugs/BugList'

const BugsPage = () => {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const filters = {}
        if (user.roles.includes('developer')) {
          filters.assignedTo = user._id
        }
        const data = await getBugs(filters)
        setBugs(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bugs')
      } finally {
        setLoading(false)
      }
    }

    fetchBugs()
  }, [user])

  if (loading && !bugs.length) {
    return <Loader size="lg" className="py-12" />
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bugs</h1>
        </div>
        
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        
        <BugsList bugs={bugs} loading={loading} />
      </div>
    </div>
  )
}

export default BugsPage