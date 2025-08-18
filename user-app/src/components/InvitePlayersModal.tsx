import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllUsers } from '@/store/slices/userSlice';
import { fetchCampaignPlayers } from '@/store/slices/campaignSlice';
import { fetchUnreadCount } from '@/store/slices/notificationSlice';
import { api } from '@/services/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import type { User, CampaignPlayer } from '@/types';

interface InvitePlayersModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

const InvitePlayersModal: React.FC<InvitePlayersModalProps> = ({
  campaignId,
  isOpen,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [recentInvitations, setRecentInvitations] = useState<Record<string, any[]>>({});
  
  // Получаем список всех пользователей и участников кампании
  const { users, isLoading: usersLoading, error: usersError } = useAppSelector((state) => state.users);
  const { campaignPlayers, isLoadingPlayers, error: playersError } = useAppSelector((state) => state.campaigns);
  
  // Загружаем данные при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers());
      dispatch(fetchCampaignPlayers(campaignId));
    }
  }, [isOpen, campaignId, dispatch]);

  // Функция для загрузки информации о последних приглашениях для пользователя
  const loadRecentInvitations = async (userId: string) => {
    try {
      const response = await api.campaigns.getRecentInvitations(campaignId, userId);
      setRecentInvitations(prev => ({
        ...prev,
        [userId]: response.data
      }));
    } catch (error) {
      console.error('Error loading recent invitations:', error);
    }
  };

  // Проверяем, участвует ли пользователь в кампании
  const isUserInCampaign = (userId: string) => {
    return campaignPlayers.some(player => player.playerId === userId);
  };

  // Проверяем, можно ли отправить приглашение пользователю
  const canInviteUser = (userId: string) => {
    const userInvitations = recentInvitations[userId] || [];
    if (userInvitations.length === 0) return true;
    
    const lastInvitation = userInvitations[0];
    const nextInviteTime = new Date(lastInvitation.nextInviteTime);
    return new Date() >= nextInviteTime;
  };

  // Получаем время следующего возможного приглашения
  const getNextInviteTime = (userId: string) => {
    const userInvitations = recentInvitations[userId] || [];
    if (userInvitations.length === 0) return null;
    
    const lastInvitation = userInvitations[0];
    return new Date(lastInvitation.nextInviteTime);
  };

  // Обработчик приглашения пользователя
  const handleInviteUser = async (userId: string) => {
    // Находим данные выбранного пользователя
    const selectedUser = users.find(user => user.id === userId);
    
    // Загружаем информацию о последних приглашениях, если еще не загружена
    if (!recentInvitations[userId]) {
      await loadRecentInvitations(userId);
    }
    
    // Проверяем, можно ли отправить приглашение
    if (!canInviteUser(userId)) {
      const nextTime = getNextInviteTime(userId);
      alert(`Приглашение уже было отправлено. Следующее приглашение можно отправить после ${nextTime?.toLocaleString('ru-RU')}`);
      return;
    }
    
    setInvitingUserId(userId);
    setIsLoading(true);
    
    try {
      await api.campaigns.invitePlayer(campaignId, userId);
      
      // Обновляем информацию о последних приглашениях
      await loadRecentInvitations(userId);
      
      // Обновляем счетчик уведомлений после успешного приглашения
      dispatch(fetchUnreadCount());
      // Можно добавить уведомление об успехе
    } catch (error: any) {
      console.error('Ошибка приглашения:', error);
      
      // Если ошибка связана с повторным приглашением, обновляем информацию
      if (error.response?.data?.message?.includes('Приглашение уже было отправлено')) {
        await loadRecentInvitations(userId);
      }
      
      // Можно добавить уведомление об ошибке
    } finally {
      setInvitingUserId(null);
      setIsLoading(false);
    }
  };



  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - затемнение фона */}
      <div 
        className="modal-backdrop fade show" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040
        }}
        onClick={onClose}
      />
      
      {/* Модальное окно */}
      <div 
        className="modal fade show" 
        style={{ 
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1050
        }} 
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg" style={{ margin: '1.75rem auto' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Пригласить игроков в кампанию</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            
            <div className="modal-body">
              {/* Показываем ошибки */}
              {(usersError || playersError) && (
                <div className="alert alert-danger">
                  <h6>Ошибка загрузки данных:</h6>
                  {usersError && <p>Пользователи: {usersError}</p>}
                  {playersError && <p>Участники кампании: {playersError}</p>}
                </div>
              )}
              
              {(usersLoading || isLoadingPlayers) ? (
                <div className="text-center py-4">
                  <LoadingSpinner />
                  <p className="mt-3 text-muted">Загрузка пользователей...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Пользователь</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Статус</th>
                        <th>Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: User) => {
                        const isInCampaign = isUserInCampaign(user.id);
                        const isInviting = invitingUserId === user.id;
                        
                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm me-3">
                                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div>
                                  <div className="fw-medium">{user.username}</div>
                                  
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'ADMIN' ? 'bg-danger' :
                                user.role === 'STRATEGIST' ? 'bg-warning' :
                                user.role === 'MODERATOR' ? 'bg-info' :
                                'bg-secondary'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              {isInCampaign ? (
                                <span className="badge bg-success">Участник</span>
                              ) : (
                                <span className="badge bg-light text-dark">Не участник</span>
                              )}
                            </td>
                            <td>
                              {isInCampaign ? (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled
                                >
                                  Уже участник
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={isInviting || isLoading || !canInviteUser(user.id)}
                                  onClick={() => handleInviteUser(user.id)}
                                >
                                  {isInviting ? (
                                    <>
                                      <LoadingSpinner size="sm" />
                                      <span className="ms-2">Приглашение...</span>
                                    </>
                                  ) : !canInviteUser(user.id) ? (
                                    'Недавно приглашен'
                                  ) : (
                                    'Пригласить'
                                  )}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {users.length === 0 && !isLoading && (
                <div className="text-center py-4 text-muted">
                  <div className="display-6 mb-3">👥</div>
                  <h5>Нет доступных пользователей</h5>
                  <p>Все пользователи уже участвуют в кампании или нет доступных аккаунтов</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitePlayersModal;
