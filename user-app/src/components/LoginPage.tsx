import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="h3 text-dark">
              Войти в BTApp
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="form-control"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="form-control"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Войти'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;