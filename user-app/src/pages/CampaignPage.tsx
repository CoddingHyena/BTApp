import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPilotsByCampaign, createPilot } from '@/store/slices/pilotSlice';
import { fetchTopLevelFactions } from '@/store/slices/factionSlice';
import { fetchCampaignById } from '@/store/slices/campaignSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PilotGenerator from '@/components/PilotGenerator';
import PilotList from '@/components/PilotList';
import InvitePlayersModal from '@/components/InvitePlayersModal';
import PlayerManagement from '@/components/PlayerManagement';
import type { GeneratedPilotData, Pilot } from '@/types';

const CampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'army' | 'pilots' | 'map' | 'missions' | 'admin'>('overview');
  const [showPilotGenerator, setShowPilotGenerator] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const dispatch = useAppDispatch();
  const { campaigns, currentCampaign, isLoading: campaignLoading, error } = useAppSelector((state) => state.campaigns);
  const { pilots, isLoading: pilotsLoading } = useAppSelector((state) => state.pilots);
  const { factions } = useAppSelector((state) => state.factions);
  const { user } = useAppSelector((state) => state.auth);
  
  // Ищем кампанию в списке или используем currentCampaign
  const campaign = campaigns.find(c => c.id === id) || currentCampaign;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    if (id) {
      // Если кампании нет в store, загружаем её по ID
      if (!campaign) {
        dispatch(fetchCampaignById(id));
      }
      dispatch(fetchPilotsByCampaign(id));
      dispatch(fetchTopLevelFactions());
    }
  }, [dispatch, id, campaign]);

  // Показываем загрузку, если загружаем кампанию
  if (campaignLoading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-muted">Загрузка кампании...</p>
      </div>
    );
  }

  // Показываем ошибку, если не удалось загрузить кампанию
  if (error) {
    return (
      <div className="text-center py-5">
        <h2 className="h3 text-dark mb-3">
          Ошибка загрузки кампании
        </h2>
        <p className="text-muted mb-4">{error}</p>
        <Link to="/campaigns">
          <Button>Вернуться к кампаниям</Button>
        </Link>
      </div>
    );
  }

  // Показываем "не найдена", если кампания не загружена
  if (!campaign) {
    return (
      <div className="text-center py-5">
        <h2 className="h3 text-dark mb-3">
          Кампания не найдена
        </h2>
        <Link to="/campaigns">
          <Button>Вернуться к кампаниям</Button>
        </Link>
      </div>
    );
  }

  // Проверяем права доступа к администрированию
  const canAccessAdmin = () => {
    if (!user) return false;
    
    // Админ имеет доступ ко всему
    if (user.role === 'ADMIN') return true;
    
    // TODO: Проверить роль пользователя в конкретной кампании
    // Пока что разрешаем доступ стратегам (в будущем нужно проверять роль в кампании)
    return user.role === 'STRATEGIST';
  };

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: '📊' },
    { id: 'army', name: 'Армия', icon: '⚔️' },
    { id: 'pilots', name: 'Пилоты', icon: '👨‍✈️' },
    { id: 'map', name: 'Карта', icon: '🗺️' },
    { id: 'missions', name: 'Миссии', icon: '🎯' },
    // Добавляем вкладку администрирования только для пользователей с правами
    ...(canAccessAdmin() ? [{ id: 'admin', name: 'Администрирование', icon: '⚙️' }] : []),
  ];

  return (
    <div className="mb-4">
      {/* Заголовок кампании */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="h2 text-dark">
                {campaign.name}
              </h1>
              <p className="text-muted">
                {campaign.description}
              </p>
              <div className="d-flex align-items-center gap-3 mt-3">
                <span className={`badge ${
                  campaign.status === 'active' ? 'bg-success' :
                  campaign.status === 'completed' ? 'bg-primary' :
                  'bg-warning'
                }`}>
                  {campaign.status === 'active' ? 'Активна' :
                   campaign.status === 'completed' ? 'Завершена' : 'Приостановлена'}
                </span>
                <small className="text-muted">
                  Создана: {new Date(campaign.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="secondary">
                Настройки
              </Button>
              <Button>
                Продолжить игру
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по вкладкам */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Содержимое вкладок */}
        <div className="card-body">
          {activeTab === 'overview' && (
            <div>
              <h3 className="h4 text-dark mb-4">
                Обзор кампании
              </h3>
              
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h4 className="h6 text-dark mb-2">Фракции</h4>
                      <p className="h2 text-primary mb-1">2</p>
                      <p className="small text-muted">Участники кампании</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h4 className="h6 text-dark mb-2">Пилоты</h4>
                      <p className="h2 text-success mb-1">{pilots.length}</p>
                      <p className="small text-muted">Пилотов в кампании</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h4 className="h6 text-dark mb-2">Сражения</h4>
                      <p className="h2 text-danger mb-1">0</p>
                      <p className="small text-muted">Проведено боёв</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-light">
                <div className="card-body">
                  <h4 className="h6 text-dark mb-3">Последние события</h4>
                  <div className="text-center py-3 text-muted">
                    <div className="display-6 mb-2">📝</div>
                    <p className="small mb-0">События появятся здесь по мере развития кампании</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'army' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 text-dark">
                  Управление армией
                </h3>
                <Link to={`/campaigns/${id}/formations`}>
                  <Button>
                    Добавить формацию
                  </Button>
                </Link>
              </div>
              
              <div className="text-center py-5 text-muted">
                <div className="display-4 mb-3">⚔️</div>
                <h4 className="h5 mb-2">Армия пуста</h4>
                <p>Создайте формации для организации армии</p>
              </div>
            </div>
          )}

          {activeTab === 'pilots' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 text-dark">
                  Управление пилотами
                </h3>
                <Button onClick={() => setShowPilotGenerator(!showPilotGenerator)}>
                  {showPilotGenerator ? 'Скрыть генератор' : 'Добавить пилота'}
                </Button>
              </div>

              {/* Генератор пилотов */}
              {showPilotGenerator && (
                <PilotGenerator
                  onPilotGenerated={async (generatedPilot: GeneratedPilotData) => {
                    if (id) {
                      try {
                        // Используем первую доступную фракцию (в будущем можно добавить выбор)
                        const faction = factions[0];
                        
                        await dispatch(createPilot({
                                                      campaignId: id,
                            factionId: faction?.id || 1,
                            firstName: generatedPilot.firstName,
                            lastName: generatedPilot.lastName,
                            callsign: generatedPilot.callsign,
                          gender: generatedPilot.gender.toUpperCase() as 'MALE' | 'FEMALE',
                          gunnery: Math.floor(Math.random() * 5) + 3, // 3-7
                          piloting: Math.floor(Math.random() * 5) + 3, // 3-7
                          alphaStrikeSkill: Math.floor(Math.random() * 5) + 3, // 3-7
                          experience: 0,
                          rank: 'MEMBER',
                          specialization: 'MECH',
                          cost: 1000
                        })).unwrap();
                        
                        // Перезагружаем список пилотов
                        dispatch(fetchPilotsByCampaign(id));
                      } catch (error) {
                        console.error('Ошибка создания пилота:', error);
                      }
                    }
                  }}
                  className="mb-6"
                />
              )}

              {/* Список пилотов */}
              {pilotsLoading ? (
                <div className="text-center py-5">
                  <LoadingSpinner />
                  <p className="mt-3 text-muted">Загрузка пилотов...</p>
                </div>
              ) : (
                <PilotList
                  pilots={pilots}
                  onEditPilot={(pilot) => {
                    console.log('Редактирование пилота:', pilot);
                    // TODO: Реализовать редактирование
                  }}
                  onSelectPilot={(pilot) => {
                    console.log('Выбор пилота:', pilot);
                    // TODO: Реализовать выбор пилота
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 text-dark">
                  Карта кампании
                </h3>
                <Button>
                  Планировать ход
                </Button>
              </div>
              
              <div className="text-center py-5 text-muted">
                <div className="display-4 mb-3">🗺️</div>
                <h4 className="h5 mb-2">Карта не загружена</h4>
                <p>Карта кампании будет доступна после создания армии</p>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 text-dark">
                  Миссии
                </h3>
                <Button>
                  Создать миссию
                </Button>
              </div>
              
              <div className="text-center py-5 text-muted">
                <div className="display-4 mb-3">🎯</div>
                <h4 className="h5 mb-2">Нет активных миссий</h4>
                <p>Создайте миссию для продвижения кампании</p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 text-dark">
                  Администрирование кампании
                </h3>
                <div className="d-flex gap-2">
                  <Button variant="secondary">
                    Экспорт данных
                  </Button>
                  <Button variant="warning">
                    Архивировать
                  </Button>
                </div>
              </div>

              <div className="row">
                {/* Основные настройки */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Основные настройки</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Название кампании</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={campaign.name}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Описание</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          defaultValue={campaign.description || ''}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Статус кампании</label>
                        <select className="form-select" defaultValue={campaign.status}>
                          <option value="active">Активна</option>
                          <option value="paused">Приостановлена</option>
                          <option value="completed">Завершена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </div>
                      <Button className="w-100">
                        Сохранить изменения
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Управление участниками */}
                <div className="col-12 mb-4">
                  <PlayerManagement 
                    campaignId={id || ''} 
                    onInvitePlayer={() => setShowInviteModal(true)}
                  />
                </div>

                {/* Настройки игры */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Настройки игры</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Правила кампании</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Введите специальные правила для этой кампании..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Длительность (часы)</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={campaign.durationHours || 24}
                          min="1"
                          max="168"
                        />
                      </div>
                      <Button variant="info" className="w-100">
                        Настроить правила
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Опасная зона */}
                <div className="col-md-6 mb-4">
                  <div className="card border-danger">
                    <div className="card-header bg-danger text-white">
                      <h5 className="mb-0">Опасная зона</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <p className="text-muted small">
                          Эти действия необратимы. Будьте осторожны.
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="danger" className="flex-fill">
                          Сбросить кампанию
                        </Button>
                        <Button variant="danger" className="flex-fill">
                          Удалить кампанию
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Статистика и логи */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Статистика и логи</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3 text-center">
                          <h4 className="text-primary">24</h4>
                          <p className="small text-muted">Всего игроков</p>
                        </div>
                        <div className="col-md-3 text-center">
                          <h4 className="text-success">12</h4>
                          <p className="small text-muted">Активных игроков</p>
                        </div>
                        <div className="col-md-3 text-center">
                          <h4 className="text-warning">8</h4>
                          <p className="small text-muted">Создано миссий</p>
                        </div>
                        <div className="col-md-3 text-center">
                          <h4 className="text-info">156</h4>
                          <p className="small text-muted">Часов игры</p>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex gap-2">
                        <Button variant="secondary" size="sm">
                          Просмотр логов
                        </Button>
                        <Button variant="secondary" size="sm">
                          Экспорт статистики
                        </Button>
                        <Button variant="secondary" size="sm">
                          Резервная копия
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
                           {/* Модальное окно приглашения игроков */}
        <InvitePlayersModal
          campaignId={id || ''}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
    </div>
  );
};

export default CampaignPage;

