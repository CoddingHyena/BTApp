import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateUserProfile } from '@/store/slices/userSlice';
import { updateUser } from '@/store/slices/authSlice';
import { fetchNotifications, fetchUnreadCount, markAsRead, deleteNotification } from '@/store/slices/notificationSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

type TabType = 'profile' | 'campaigns' | 'settings' | 'notifications';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем уведомления при переключении на вкладку уведомлений
  useEffect(() => {
    if (activeTab === 'notifications') {
      dispatch(fetchNotifications());
    }
  }, [activeTab, dispatch]);

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: '👤' },
    { id: 'campaigns', name: 'Мои кампании', icon: '🎮' },
    { id: 'settings', name: 'Настройки', icon: '⚙️' },
    { id: 'notifications', name: 'Уведомления', icon: '🔔' },
  ];

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Заголовок */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Личный кабинет</h1>
          <p className="text-muted mb-0">Управление профилем и настройками</p>
        </div>
        <Button variant="secondary" onClick={() => window.history.back()}>
          ← Назад
        </Button>
      </div>

      {/* Навигация по вкладкам */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill">
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{ border: 'none', background: 'none' }}
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Содержимое вкладок */}
      <div className="card">
        <div className="card-body">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
};

// Компонент вкладки "Профиль"
const ProfileTab: React.FC<{ user: any }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
  });

  const handleSave = async () => {
    try {
      const updatedUser = await dispatch(updateUserProfile({
        id: user.id,
        data: {
          username: formData.username,
        }
      })).unwrap();
      
      // Обновляем данные пользователя в auth slice для синхронизации в навигации
      dispatch(updateUser(updatedUser));
      
      setIsEditing(false);
      // Показываем уведомление об успехе (можно добавить toast)
      console.log('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      // Показываем ошибку пользователю
    }
  };

  return (
    <div>
             <div className="d-flex justify-content-between align-items-center mb-4">
         <h4>Профиль пользователя</h4>
         <Button
           variant={isEditing ? 'success' : 'primary'}
           onClick={isEditing ? handleSave : () => setIsEditing(true)}
           disabled={isLoading}
         >
           {isLoading ? (
             <>
               <LoadingSpinner size="sm" />
               <span className="ms-2">Сохранение...</span>
             </>
           ) : isEditing ? 'Сохранить' : 'Редактировать'}
         </Button>
       </div>

       {error && (
         <div className="alert alert-danger mb-3">
           Ошибка обновления профиля: {error}
         </div>
       )}

      <div className="row">
        <div className="col-md-3 text-center">
          <div className="mb-3">
                         <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-3" 
                  style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
               {user.username.charAt(0).toUpperCase()}
             </div>
            <Button variant="outline-primary" size="sm" disabled={!isEditing}>
              Изменить аватар
            </Button>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Имя пользователя</label>
              <input
                type="text"
                className="form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email}
                disabled
              />
              <small className="text-muted">Email нельзя изменить</small>
            </div>
          </div>

          

          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Дата регистрации</label>
              <input
                type="text"
                className="form-control"
                value={new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU')}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Роль</label>
              <input
                type="text"
                className="form-control"
                value={user.role}
                disabled
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Отменить
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент вкладки "Мои кампании"
const CampaignsTab: React.FC = () => {
  return (
    <div>
      <h4>Мои кампании</h4>
      <p className="text-muted">Здесь будут отображаться ваши кампании</p>
      <div className="text-center py-4">
        <div className="display-6 mb-3">🎮</div>
        <h5>Функция в разработке</h5>
        <p>Скоро здесь появится список ваших кампаний</p>
      </div>
    </div>
  );
};

// Компонент вкладки "Настройки"
const SettingsTab: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async () => {
    // TODO: Реализовать смену пароля
    console.log('Смена пароля:', passwordData);
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div>
      <h4>Настройки аккаунта</h4>
      
      <div className="mb-4">
        <h5>Смена пароля</h5>
        {!showPasswordForm ? (
          <Button variant="primary" onClick={() => setShowPasswordForm(true)}>
            Изменить пароль
          </Button>
        ) : (
          <div className="card p-3">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Текущий пароль</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Новый пароль</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3">
              <Button variant="success" onClick={handlePasswordChange}>
                Сохранить пароль
              </Button>
              <Button 
                variant="secondary" 
                className="ms-2"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                Отменить
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h5>Email уведомления</h5>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="notifyInvites" defaultChecked />
          <label className="form-check-label" htmlFor="notifyInvites">
            Приглашения в кампании
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="notifyUpdates" defaultChecked />
          <label className="form-check-label" htmlFor="notifyUpdates">
            Обновления в кампаниях
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="notifySystem" defaultChecked />
          <label className="form-check-label" htmlFor="notifySystem">
            Системные уведомления
          </label>
        </div>
      </div>
    </div>
  );
};

// Компонент вкладки "Уведомления"
const NotificationsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);

  // Загружаем уведомления и счетчик при монтировании компонента
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      // Обновляем счетчик после отметки как прочитанного
      dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      // Обновляем счетчик после удаления
      dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner />
        <p className="mt-2">Загрузка уведомлений...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Уведомления</h4>
        </div>
        
        <div className="text-center py-4">
          <div className="display-6 mb-3">🔔</div>
          <h5>Нет уведомлений</h5>
          <p>У вас пока нет новых уведомлений</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Уведомления</h4>
      </div>
      
      <div className="list-group">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`list-group-item list-group-item-action ${
              notification.status === 'UNREAD' ? 'list-group-item-primary' : ''
            }`}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-1">{notification.title}</h6>
                  <small className="text-muted">{formatDate(notification.createdAt)}</small>
                </div>
                <p className="mb-1">{notification.message}</p>
                {notification.sender && (
                  <small className="text-muted">
                    От: {notification.sender.username}
                  </small>
                )}
                {notification.campaign && (
                  <small className="text-muted ms-2">
                    Кампания: {notification.campaign.name}
                  </small>
                )}
              </div>
              <div className="ms-3">
                {notification.status === 'UNREAD' && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Прочитано
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(notification.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
