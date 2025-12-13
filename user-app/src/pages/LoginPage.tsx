import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login, initializeAuth } from '@/store/slices/authSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const { isLoading, error, user, token, isInitialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Инициализируем аутентификацию при загрузке страницы
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на главную страницу
    if (isInitialized && user && token) {
      navigate('/');
    }
  }, [isInitialized, user, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  // Показываем спиннер во время инициализации
  if (!isInitialized || isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Если пользователь уже авторизован, не показываем форму
  if (user && token) {
    return null;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h2 className="card-title">🎮 BTApp</h2>
              <p className="text-muted">Войдите в игру</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Войти'}
              </Button>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Нет аккаунта?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



