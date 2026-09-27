import { Navigate } from 'react-router-dom'
import { obterToken } from '../api'

function ProtectedRoute({ children }) {
  if (!obterToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute