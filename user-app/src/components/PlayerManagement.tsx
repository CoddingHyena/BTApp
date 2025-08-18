import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCampaignPlayers } from '@/store/slices/campaignSlice';
import { api } from '@/services/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import type { CampaignPlayer, Faction } from '@/types';

interface PlayerManagementProps {
  campaignId: string;
  onInvitePlayer?: () => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ campaignId, onInvitePlayer }) => {
  const dispatch = useAppDispatch();
  const { campaignPlayers, isLoadingPlayers } = useAppSelector((state) => state.campaigns);
  
  const [selectedPlayer, setSelectedPlayer] = useState<CampaignPlayer | null>(null);
  const [showFactionModal, setShowFactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignFactions, setCampaignFactions] = useState<Faction[]>([]);
  const [isLoadingFactions, setIsLoadingFactions] = useState(false);

  useEffect(() => {
    dispatch(fetchCampaignPlayers(campaignId));
    loadCampaignFactions();
  }, [dispatch, campaignId]);

  const loadCampaignFactions = async () => {
    setIsLoadingFactions(true);
    try {
      const response = await api.campaigns.getCampaignFactions(campaignId);
      setCampaignFactions(response.data);
    } catch (error) {
      console.error('Error loading campaign factions:', error);
    } finally {
      setIsLoadingFactions(false);
    }
  };

  // Группируем игроков по фракциям
  const playersByFaction = campaignPlayers.reduce((acc, player) => {
    const factionId = player.faction?.id || 'neutral';
    if (!acc[factionId]) {
      acc[factionId] = {
        faction: player.faction,
        players: []
      };
    }
    acc[factionId].players.push(player);
    return acc;
  }, {} as Record<string, { faction: Faction | null; players: CampaignPlayer[] }>);

  // Получаем доступные фракции для перемещения (только зафиксированные фракции кампании, исключая текущую фракцию игрока)
  const getAvailableFactions = (currentFactionId?: number | null) => {
    if (currentFactionId === null) {
      return campaignFactions; // Для нейтральных игроков показываем зафиксированные фракции кампании
    }
    return campaignFactions.filter(faction => faction.id !== currentFactionId);
  };

  const handleMovePlayer = async (campaignPlayerId: string, newFactionId: number | null) => {
    console.log('=== FRONTEND MOVE PLAYER DEBUG ===');
    console.log('Campaign ID:', campaignId);
    console.log('Campaign Player ID:', campaignPlayerId);
    console.log('New Faction ID:', newFactionId);
    
    setIsLoading(true);
    try {
      // Вызываем API для обновления фракции игрока
      console.log('Calling API...');
      const response = await api.campaigns.updatePlayerFaction(campaignId, campaignPlayerId, newFactionId);
      console.log('API response:', response);
      
      // Обновляем список игроков
      console.log('Refreshing player list...');
      dispatch(fetchCampaignPlayers(campaignId));
      
      setShowFactionModal(false);
      setSelectedPlayer(null);
      console.log('=== END FRONTEND MOVE PLAYER DEBUG ===');
    } catch (error) {
      console.error('Error moving player:', error);
      console.log('=== END FRONTEND MOVE PLAYER DEBUG ===');
      alert('Ошибка при перемещении игрока. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const openFactionModal = (player: CampaignPlayer) => {
    setSelectedPlayer(player);
    setShowFactionModal(true);
  };

  const closeFactionModal = () => {
    setShowFactionModal(false);
    setSelectedPlayer(null);
  };

  if (isLoadingPlayers || isLoadingFactions) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-muted">Загрузка данных кампании...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="h5 mb-0">Управление участниками</h4>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">
            Всего участников: {campaignPlayers.length}
          </div>
          {onInvitePlayer && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onInvitePlayer}
            >
              Пригласить игрока
            </Button>
          )}
        </div>
      </div>

      {/* Нейтральные игроки */}
      {playersByFaction['neutral'] && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <span className="text-muted">🎭</span> Нейтральные игроки
              <span className="badge bg-secondary ms-2">
                {playersByFaction['neutral'].players.length}
              </span>
            </h5>
          </div>
          <div className="card-body">
            {playersByFaction['neutral'].players.length === 0 ? (
              <p className="text-muted mb-0">Нет нейтральных игроков</p>
            ) : (
              <div className="row">
                {playersByFaction['neutral'].players.map(player => (
                  <div key={player.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card border-secondary">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{player.user?.username || player.player?.username || 'Неизвестный игрок'}</h6>
                            <p className="small text-muted mb-2">
                              {player.user?.email || player.player?.email || ''}
                            </p>
                            <div className="d-flex gap-1">
                              <span className="badge bg-secondary">Нейтральный</span>
                              {player.role && (
                                <span className="badge bg-info">{player.role}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openFactionModal(player)}
                          >
                            Переместить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Игроки по фракциям */}
      {Object.entries(playersByFaction)
        .filter(([factionId]) => factionId !== 'neutral')
        .map(([factionId, { faction, players }]) => (
          <div key={factionId} className="card mb-4">
            <div className="card-header" style={{ 
              backgroundColor: faction?.color || '#f8f9fa',
              color: faction?.color ? '#fff' : '#000'
            }}>
              <h5 className="mb-0">
                <span>{faction?.icon || '⚔️'}</span> {faction?.name || 'Неизвестная фракция'}
                <span className="badge bg-light text-dark ms-2">
                  {players.length}
                </span>
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {players.map(player => (
                  <div key={player.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{player.user?.username || player.player?.username || 'Неизвестный игрок'}</h6>
                            <p className="small text-muted mb-2">
                              {player.user?.email || player.player?.email || ''}
                            </p>
                            <div className="d-flex gap-1">
                              <span className="badge bg-primary">{faction?.name}</span>
                              {player.role && (
                                <span className="badge bg-info">{player.role}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openFactionModal(player)}
                          >
                            Переместить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

      {/* Модальное окно выбора фракции */}
      {showFactionModal && selectedPlayer && (
        <>
          {/* Backdrop */}
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
            onClick={closeFactionModal}
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
            <div className="modal-dialog" style={{ margin: '1.75rem auto' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Переместить игрока</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeFactionModal}
                    aria-label="Close"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="modal-body">
                  <p>
                    Переместить игрока <strong>{selectedPlayer.user?.username || selectedPlayer.player?.username || 'Неизвестный игрок'}</strong> в другую фракцию:
                  </p>
                  
                  <div className="mb-3">
                    <label className="form-label">Выберите фракцию</label>
                    <select 
                      className="form-select" 
                      id="factionSelect"
                      disabled={isLoading}
                    >
                      <option value="">Выберите фракцию</option>
                      <option value="neutral">Нейтральный</option>
                      {getAvailableFactions(selectedPlayer.faction?.id).map(faction => (
                        <option key={faction.id} value={faction.id}>
                          {faction.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                                                              <div className="alert alert-info">
                           <h6 className="alert-heading">ℹ️ Информация</h6>
                           <p className="mb-0">
                             В списке показаны только зафиксированные фракции данной кампании. 
                             При перемещении игрока в новую фракцию, он получит доступ к ресурсам и возможностям этой фракции.
                           </p>
                         </div>
                </div>
                
                <div className="modal-footer">
                  <Button 
                    variant="secondary" 
                    onClick={closeFactionModal}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      const select = document.getElementById('factionSelect') as HTMLSelectElement;
                      const factionId = select.value;
                      if (factionId) {
                        const newFactionId = factionId === 'neutral' ? null : parseInt(factionId);
                        handleMovePlayer(selectedPlayer.id, newFactionId);
                      } else {
                        alert('Пожалуйста, выберите фракцию');
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ms-2">Перемещение...</span>
                      </>
                    ) : (
                      'Переместить'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerManagement;
