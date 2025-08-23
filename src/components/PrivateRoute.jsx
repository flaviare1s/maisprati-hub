// src/components/PrivateRoute.jsx
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

  // 3. O tipo de usuário não corresponde ao tipo requerido para a rota
  if (requiredType && user.type !== requiredType) {
    // Você pode redirecionar para uma página de "acesso negado" ou para a home
    return <Navigate to="/401" replace />;
  }

  return children;
};
