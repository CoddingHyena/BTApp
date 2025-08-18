import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createCampaign, fetchAvailableUsers, assignStrategist } from '@/store/slices/campaignSlice';
import { fetchTopLevelFactions } from '@/store/slices/factionSlice';
import { fetchActiveGames } from '@/store/slices/gameSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { User, Faction } from '@/types';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  description: string;
  selectedGameId: string;
  selectedFactions: number[];
  strategists: { [factionId: number]: string }; // factionId -> userId
}

const CreateCampaignPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    selectedGameId: '',
    selectedFactions: [],
    strategists: {},
  });

  const { factions, isLoading: factionsLoading } = useAppSelector((state) => state.factions);
  const { games, isLoading: gamesLoading } = useAppSelector((state) => state.games);
  const { availableUsers, isLoading: creating, error } = useAppSelector((state) => state.campaigns);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTopLevelFactions());
    dispatch(fetchActiveGames());
  }, [dispatch]);

  // Фильтруем фракции по выбранной игре
  const filteredFactions = useMemo(() => {
    if (!formData.selectedGameId) {
      return factions;
    }
    return factions.filter(faction => faction.gameIdRef === formData.selectedGameId);
  }, [factions, formData.selectedGameId]);

  // Очищаем выбранные фракции при смене игры
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedFactions: [],
      strategists: {}
    }));
  }, [formData.selectedGameId]);

  // Загружаем доступных пользователей при переходе на шаг 3
  useEffect(() => {
    if (currentStep === 3) {
      // Загружаем всех активных пользователей (временно без проверки кампании)
      dispatch(fetchAvailableUsers('temp')); // Временно используем 'temp' как ID
    }
  }, [currentStep, dispatch]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        alert('Введите название кампании');
        return;
      }
      if (!formData.selectedGameId) {
        alert('Выберите игру для кампании');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (formData.selectedFactions.length < 2) {
        alert('Выберите минимум 2 фракции');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Проверяем, что все фракции имеют назначенных стратегов
      const unassignedFactions = formData.selectedFactions.filter(
        factionId => !formData.strategists[factionId]
      );
      if (unassignedFactions.length > 0) {
        alert('Назначьте стратегов для всех выбранных фракций');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем кампанию
    const result = await dispatch(createCampaign({
      name: formData.name,
      description: formData.description,
      gameId: formData.selectedGameId,
      campaignType: 'MAIN' as any,
      status: 'ACTIVE' as any,
      factionIds: formData.selectedFactions,
    }));

    if (createCampaign.fulfilled.match(result)) {
      const campaignId = result.payload.id;
      
      // Назначаем стратегов
      const assignPromises = Object.entries(formData.strategists).map(([factionId, userId]) =>
        dispatch(assignStrategist({
          campaignId,
          data: {
            userId,
            factionId: parseInt(factionId)
          }
        }))
      );

      try {
        await Promise.all(assignPromises);
        navigate(`/campaigns/${campaignId}`);
      } catch (error) {
        console.error('Ошибка назначения стратегов:', error);
        // Все равно переходим к кампании, даже если назначение стратегов не удалось
        navigate(`/campaigns/${campaignId}`);
      }
    }
  };

  const toggleFaction = (factionId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedFactions: prev.selectedFactions.includes(factionId)
        ? prev.selectedFactions.filter(id => id !== factionId)
        : [...prev.selectedFactions, factionId],
      strategists: prev.selectedFactions.includes(factionId)
        ? { ...prev.strategists, [factionId]: undefined }
        : prev.strategists
    }));
  };

  const assignStrategistToFaction = (factionId: number, userId: string) => {
    setFormData(prev => ({
      ...prev,
      strategists: {
        ...prev.strategists,
        [factionId]: userId
      }
    }));
  };

  const getFactionName = (factionId: number): string => {
    const faction = factions.find(f => f.id === factionId);
    return faction?.name || `Фракция ${factionId}`;
  };

  const getUserName = (userId: string): string => {
    const user = availableUsers.find(u => u.id === userId);
    return user ? user.username : 'Неизвестный пользователь';
  };

  if (factionsLoading || gamesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="h2 text-dark">
          Создать новую кампанию
        </h1>
        <p className="text-muted">
          Пошаговое создание кампании с назначением стратегов
        </p>
      </div>

      {/* Индикатор прогресса */}
      <div className="mb-4">
        <div className="progress" style={{ height: '4px' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <small className={currentStep >= 1 ? 'text-primary' : 'text-muted'}>Основная информация</small>
          <small className={currentStep >= 2 ? 'text-primary' : 'text-muted'}>Выбор фракций</small>
          <small className={currentStep >= 3 ? 'text-primary' : 'text-muted'}>Назначение стратегов</small>
          <small className={currentStep >= 4 ? 'text-primary' : 'text-muted'}>Создание</small>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Шаг 1: Основная информация */}
        {currentStep === 1 && (
          <div className="card">
            <div className="card-body">
              <h3 className="h4 mb-4">Основная информация</h3>
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Название кампании *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Описание</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="game" className="form-label">Игра *</label>
                <select
                  className="form-select"
                  id="game"
                  value={formData.selectedGameId}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedGameId: e.target.value }))}
                  required
                >
                  <option value="">Выберите игру</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Выбор фракций */}
        {currentStep === 2 && (
          <div className="card">
            <div className="card-body">
              <h3 className="h4 mb-4">Выбор фракций</h3>
              <p className="text-muted mb-4">
                Выберите минимум 2 основные фракции для участия в кампании. 
                Дочерние фракции будут доступны после создания кампании.
              </p>

              <div className="row">
                {filteredFactions.map((faction) => (
                  <div key={faction.id} className="col-md-6 col-lg-4 mb-3">
                    <div 
                      className={`card h-100 cursor-pointer ${
                        formData.selectedFactions.includes(faction.id) ? 'border-primary' : ''
                      }`}
                      onClick={() => toggleFaction(faction.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="card-title mb-2">{faction.name}</h5>
                          <div className="d-flex gap-1">
                            {faction.isMajor && (
                              <span className="badge bg-warning">Основная</span>
                            )}
                            <span className="badge bg-primary">Корневая</span>
                          </div>
                        </div>
                        {faction.description && (
                          <p className="card-text small text-muted">{faction.description}</p>
                        )}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.selectedFactions.includes(faction.id)}
                            onChange={() => {}}
                          />
                          <label className="form-check-label">
                            Выбрать фракцию
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.selectedFactions.length > 0 && (
                <div className="mt-4">
                  <h5>Выбранные фракции ({formData.selectedFactions.length}):</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.selectedFactions.map(factionId => (
                      <span key={factionId} className="badge bg-primary">
                        {getFactionName(factionId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Шаг 3: Назначение стратегов */}
        {currentStep === 3 && (
          <div className="card">
            <div className="card-body">
              <h3 className="h4 mb-4">Назначение стратегов</h3>
              <p className="text-muted mb-4">
                Для каждой фракции назначьте стратега, который будет управлять ею
              </p>

              {formData.selectedFactions.map((factionId) => (
                <div key={factionId} className="mb-4 p-3 border rounded">
                  <h5 className="mb-3">{getFactionName(factionId)}</h5>
                  
                  <div className="row">
                    <div className="col-md-8">
                      <label className="form-label">Стратег:</label>
                      <select
                        className="form-select"
                        value={formData.strategists[factionId] || ''}
                        onChange={(e) => assignStrategistToFaction(factionId, e.target.value)}
                      >
                        <option value="">Выберите стратега</option>
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.id}>
                            {getUserName(user.id)} ({user.username})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      {formData.strategists[factionId] && (
                        <div className="text-success">
                          <i className="bi bi-check-circle me-2"></i>
                          Назначен: {getUserName(formData.strategists[factionId])}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Шаг 4: Подтверждение */}
        {currentStep === 4 && (
          <div className="card">
            <div className="card-body">
              <h3 className="h4 mb-4">Подтверждение создания</h3>
              
              <div className="row">
                <div className="col-md-6">
                  <h5>Основная информация:</h5>
                  <p><strong>Название:</strong> {formData.name}</p>
                  <p><strong>Описание:</strong> {formData.description || 'Не указано'}</p>
                  <p><strong>Игра:</strong> {games.find(g => g.id === formData.selectedGameId)?.name}</p>
                </div>
                <div className="col-md-6">
                  <h5>Фракции и стратеги:</h5>
                  {formData.selectedFactions.map(factionId => (
                    <div key={factionId} className="mb-2">
                      <strong>{getFactionName(factionId)}:</strong> {getUserName(formData.strategists[factionId])}
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle me-2"></i>
                После создания кампании вы сможете управлять ею и добавлять игроков
              </div>
            </div>
          </div>
        )}

        {/* Навигационные кнопки */}
        <div className="d-flex justify-content-between mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Назад
          </Button>
          
          <div>
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={creating}
              >
                Далее
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <LoadingSpinner size="sm" className="me-2" />
                    Создание...
                  </>
                ) : (
                  'Создать кампанию'
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateCampaignPage;



