import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCampaignById } from '@/store/slices/campaignSlice';
import { fetchTopLevelFactions } from '@/store/slices/factionSlice';
import { api } from '@/services/api';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import FormationModal from '@/components/FormationModal';
import type { CombatFormation } from '@/types';

const FormationsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [formations, setFormations] = useState<CombatFormation[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  
  const dispatch = useAppDispatch();
  const { currentCampaign, isLoading: campaignLoading, error } = useAppSelector((state) => state.campaigns);
  const { factions } = useAppSelector((state) => state.factions);
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    if (campaignId) {
      dispatch(fetchCampaignById(campaignId));
      dispatch(fetchTopLevelFactions());
      loadFormations();
    }
  }, [dispatch, campaignId]);

  const loadFormations = async () => {
    if (!campaignId) return;
    
    console.log('Loading formations for campaign:', campaignId);
    setIsLoadingFormations(true);
    try {
      const response = await api.formations.getByCampaign(campaignId);
      console.log('Formations response:', response);
      setFormations(response.data);
    } catch (error) {
      console.error('Error loading formations:', error);
    } finally {
      setIsLoadingFormations(false);
    }
  };

  if (campaignLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3">Загрузка кампании...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Ошибка загрузки кампании</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Кампания не найдена</h4>
          <p>Запрашиваемая кампания не существует или была удалена.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Заголовок страницы */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-2">Формации кампании</h1>
          <p className="text-muted mb-0">
            Управление формациями в кампании "{currentCampaign.name}"
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
            ← Назад к кампании
          </Link>
          <Button 
            variant="primary" 
            onClick={() => setShowFormationModal(true)}
          >
            + Добавить формацию
          </Button>
        </div>
      </div>

      {/* Информация о кампании */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Информация о кампании</h5>
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">Название</small>
                  <p className="mb-2">{currentCampaign.name}</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Статус</small>
                  <p className="mb-2">
                    <span className={`badge ${
                      currentCampaign.status === 'ACTIVE' ? 'bg-success' :
                      currentCampaign.status === 'DRAFT' ? 'bg-warning' :
                      currentCampaign.status === 'PAUSED' ? 'bg-info' :
                      'bg-secondary'
                    }`}>
                      {currentCampaign.status}
                    </span>
                  </p>
                </div>
              </div>
              {currentCampaign.description && (
                <div>
                  <small className="text-muted">Описание</small>
                  <p className="mb-0">{currentCampaign.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Статистика формаций</h5>
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 mb-1 text-primary">{formations.length}</div>
                  <small className="text-muted">Всего формаций</small>
                </div>
                <div className="col-4">
                  <div className="h4 mb-1 text-success">{formations.filter(f => f.status === 'ACTIVE').length}</div>
                  <small className="text-muted">Активных</small>
                </div>
                <div className="col-4">
                  <div className="h4 mb-1 text-warning">{formations.filter(f => f.status === 'IN_BATTLE').length}</div>
                  <small className="text-muted">В бою</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список формаций */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Список формаций</h5>
        </div>
        <div className="card-body">
          {isLoadingFormations ? (
            <div className="text-center py-4">
              <LoadingSpinner />
              <p className="mt-3 text-muted">Загрузка формаций...</p>
            </div>
          ) : formations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="display-6 mb-3">⚔️</div>
              <h5>Формации не найдены</h5>
              <p>Создайте первую формацию для начала формирования армии</p>
              <Button 
                variant="primary" 
                onClick={() => setShowFormationModal(true)}
              >
                Создать формацию
              </Button>
            </div>
          ) : (
            <div className="row">
              {formations.map((formation) => (
                <div key={formation.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{formation.name}</h6>
                        <span className={`badge ${
                          formation.status === 'ACTIVE' ? 'bg-success' :
                          formation.status === 'IN_BATTLE' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {formation.status}
                        </span>
                      </div>
                      <p className="card-text small text-muted mb-2">
                        Тип: {formation.type}
                      </p>
                      {formation.description && (
                        <p className="card-text small">{formation.description}</p>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Фракция: {factions.find(f => f.id === formation.factionId)?.name || 'Неизвестно'}
                        </small>
                        <Button variant="outline-primary" size="sm">
                          Управлять
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

      {/* Модальное окно создания формации */}
      <FormationModal
        campaignId={campaignId || ''}
        isOpen={showFormationModal}
        onClose={() => setShowFormationModal(false)}
        onFormationCreated={loadFormations}
      />
    </div>
  );
};

export default FormationsPage;
