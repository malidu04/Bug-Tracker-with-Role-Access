import { useEffect, useState } from 'react'
import { getBugs } from '../../services/bugsService'
import { useAuth } from '../../context/authContext'
import Alert from '../../components/ui/Alert'
import { BUG_STATUS } from '../../utils/constants'
import Loader from '../../components/ui/Loader'

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })
  const [recentBugs, setRecentBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filters = {}
        if (user.roles.includes('developer')) {
          filters.assignedTo = user._id
        }

        const bugs = await getBugs(filters)
        setRecentBugs(bugs.slice(0, 5))
        
        setStats({
          total: bugs.length,
          open: bugs.filter(b => b.status === BUG_STATUS.OPEN).length,
          inProgress: bugs.filter(b => b.status === BUG_STATUS.IN_PROGRESS).length,
          resolved: bugs.filter(b => b.status === BUG_STATUS.RESOLVED || b.status === BUG_STATUS.CLOSED).length
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return <Loader size="lg" className="py-12" />
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Bugs</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Open</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.open}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{stats.inProgress}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bugs</h2>
          {recentBugs.length > 0 ? (
            <div className="space-y-4">
              {recentBugs.map(bug => (
                <div key={bug._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-blue-600 hover:text-blue-800">
                      <a href={`/bugs/${bug._id}`}>{bug.title}</a>
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      bug.status === BUG_STATUS.OPEN ? 'bg-gray-100 text-gray-800' :
                      bug.status === BUG_STATUS.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {bug.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{bug.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent bugs found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage