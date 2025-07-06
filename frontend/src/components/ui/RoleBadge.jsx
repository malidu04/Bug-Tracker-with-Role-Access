import { ROLE_COLORS } from '../../utils/constants'

const RoleBadge = ({ role }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-800'}`}
    >
      {role}
    </span>
  )
}

export default RoleBadge