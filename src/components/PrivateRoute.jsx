import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';

export const PrivateRoute = ({ children, requireGroup = false }) => {
  const { user } = useAuth();

  // Se não há usuário, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer grupo e o usuário não é admin nem tem grupo, redireciona para home
  if (requireGroup && !isAdmin(user) && !(user.type === 'student' && user.hasGroup)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
