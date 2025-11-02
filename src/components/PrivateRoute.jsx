import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { useEffect } from 'react';

export const PrivateRoute = ({ children, requiredType = null, requireGroup = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log para debug (sempre executado)
  useEffect(() => {
    if (!user && !loading) {
      console.log(`PrivateRoute: Usuário não autenticado em ${location.pathname}`);
    }
  }, [user, loading, location.pathname]);

  // Verifica se ainda está carregando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-logo"></div>
      </div>
    );
  }

  // Redireciona para login se não está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se precisa de grupo
  if (requireGroup && !isAdmin(user) && !(user.type === 'student' && user.hasGroup)) {
    return <Navigate to="/" replace />;
  }

  // Verifica tipo de usuário
  if (requiredType && user.type !== requiredType) {
    return <Navigate to="/401" replace />;
  }

  return children;
};
