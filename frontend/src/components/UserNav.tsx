import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/slices/authSlice';

const UserNav: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'MODERATOR':
        return 'Модератор';
      case 'PLAYER':
        return 'Игрок';
      default:
        return role;
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center me-3">
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-medium" style={{width: '32px', height: '32px'}}>
          {user.username[0].toUpperCase()}
        </div>
        <div className="d-none d-md-block ms-2">
          <div className="small fw-medium">
            {user.username}
          </div>
          <div className="text-muted small">
            {getRoleDisplayName(user.role)}
          </div>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="btn btn-outline-secondary btn-sm"
      >
        Выйти
      </button>
    </div>
  );
};

export default UserNav; 