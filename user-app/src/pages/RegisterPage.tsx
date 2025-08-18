import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { register, initializeAuth } from '@/store/slices/authSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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
      navigate('/campaigns');
    }
  }, [isInitialized, user, token, navigate]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    // Валидация username
    if (!formData.username.trim()) {
      errors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    } else if (formData.username.length > 20) {
      errors.username = 'Имя пользователя не должно превышать 20 символов';
    }

    // Валидация email
    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email';
    }

    // Валидация пароля
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await dispatch(register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }));

    if (register.fulfilled.match(result)) {
      navigate('/campaigns');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Очищаем ошибку валидации при вводе
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
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
              <p className="text-muted">Создайте аккаунт</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <input
                  id="username"
                  type="text"
                  className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`}
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  required
                  minLength={3}
                  maxLength={20}
                />
                {validationErrors.username && (
                  <div className="invalid-feedback">
                    {validationErrors.username}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
                {validationErrors.email && (
                  <div className="invalid-feedback">
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  minLength={6}
                />
                {validationErrors.password && (
                  <div className="invalid-feedback">
                    {validationErrors.password}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                />
                {validationErrors.confirmPassword && (
                  <div className="invalid-feedback">
                    {validationErrors.confirmPassword}
                  </div>
                )}
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
                {isLoading ? <LoadingSpinner size="sm" /> : 'Зарегистрироваться'}
              </Button>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Войти
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

export default RegisterPage;
