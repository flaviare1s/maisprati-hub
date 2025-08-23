import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';

export const PrivateRoute = ({ children, requiredType = null, requireGroup = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireGroup && !isAdmin(user) && !(user.type === 'student' && user.hasGroup)) {
    return <Navigate to="/" replace />;
  }

  if (requiredType && user.type !== requiredType) {
    return <Navigate to="/401" replace />;
  }

  return children;
};
