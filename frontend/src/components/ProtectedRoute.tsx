import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('PLAYER' | 'MODERATOR' | 'ADMIN')[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallback 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Если пользователь не аутентифицирован
  if (!isAuthenticated) {
    return fallback || (
      <div className="text-center p-5">
        <h2 className="h3 text-dark mb-3">Требуется авторизация</h2>
        <p className="text-muted mb-4">
          Для доступа к этой странице необходимо войти в систему.
        </p>
        <a
          href="/login"
          className="btn btn-primary"
        >
          Войти
        </a>
      </div>
    );
  }

  // Если указаны требуемые роли, проверяем права доступа
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      return fallback || (
        <div className="text-center p-5">
          <h2 className="h3 text-danger mb-3">Недостаточно прав</h2>
          <p className="text-muted mb-4">
            Для доступа к этой странице требуются следующие роли: {requiredRoles.join(', ')}
          </p>
          <p className="text-muted small">
            Ваша роль: {user.role}
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 