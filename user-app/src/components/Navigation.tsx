import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { fetchUnreadCount } from '@/store/slices/notificationSlice';

const Navigation: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Загружаем количество непрочитанных уведомлений при загрузке компонента
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🎮 BTApp
        </Link>
        
        {user ? (
          <div className="navbar-nav ms-auto d-flex align-items-center">
            <Link 
              to="/missions" 
              className={`nav-link ${isActive('/missions') ? 'active' : ''}`}
            >
              Миссии
            </Link>
            <Link 
              to="/campaigns" 
              className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}
            >
              Кампании
            </Link>
            
            <div className="navbar-nav ms-3 d-flex align-items-center">
              <span className="navbar-text me-3">
                {user.username}
              </span>
              <Link
                to="/profile"
                className="btn btn-outline-light btn-sm me-2 position-relative"
              >
                👤 Личный кабинет
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm"
              >
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-outline-light"
          >
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;