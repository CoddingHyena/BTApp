import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { initializeAuth } from '@/store/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Token:', token);
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - IsInitialized:', isInitialized);
    
    // Инициализируем аутентификацию только один раз при загрузке
    if (!isInitialized) {
      console.log('ProtectedRoute - Initializing auth...');
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  // Если еще не инициализировали аутентификацию или идет загрузка, показываем спиннер
  if (!isInitialized || isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Если нет токена или пользователя после инициализации, перенаправляем на логин
  if (!token || !user) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если все в порядке, показываем защищенный контент
  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
