import BugItem from './BugItem'
import Loader from '../ui/Loader'

const BugsList = ({ bugs, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="lg" />
      </div>
    )
  }

  if (!bugs || bugs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bugs found. Create one to get started!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bugs.map((bug) => (
        <BugItem key={bug._id} bug={bug} />
      ))}
    </div>
  )
}

export default BugsList