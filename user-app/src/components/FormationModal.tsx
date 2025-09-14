import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { api } from '@/services/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface FormationModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onFormationCreated?: () => void;
}

const FormationModal: React.FC<FormationModalProps> = ({
  campaignId,
  isOpen,
  onClose,
  onFormationCreated
}) => {
  const dispatch = useAppDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFactions, setIsLoadingFactions] = useState(false);
  const [campaignFactions, setCampaignFactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    factionId: '',
    description: ''
  });

  // Загружаем зафиксированные фракции кампании при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadCampaignFactions();
    }
  }, [isOpen, campaignId]);

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

  const unitTypes = [
    { value: 'LANCE', label: 'Лэнс (4 юнита)' },
    { value: 'COMPANY', label: 'Рота (12 юнитов)' },
    { value: 'DIVISION', label: 'Дивизия (40 юнитов)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.factionId) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsLoading(true);
    
    try {
      // Создаем формацию через API
      const formationData = {
        campaignId,
        factionId: parseInt(formData.factionId),
        name: formData.name,
        type: formData.type as any
      };
      
      console.log('Creating formation:', formationData);
      
      const response = await api.formations.create(formationData);
      console.log('Formation created:', response.data);
      
      // Закрываем модальное окно и сбрасываем форму
      onClose();
      setFormData({
        name: '',
        type: '',
        factionId: '',
        description: ''
      });
      
      // Показываем уведомление об успехе
      alert('Формация успешно создана!');
      
      // Обновляем список формаций
      if (onFormationCreated) {
        onFormationCreated();
      }
    } catch (error) {
      console.error('Error creating formation:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert('Ошибка при создании формации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setFormData({
        name: '',
        type: '',
        factionId: '',
        description: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
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
        onClick={handleClose}
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
              <h5 className="modal-title">Создать новую формацию</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
                disabled={isLoading}
              />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Название формации <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Например: Альфа Ланс"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="type" className="form-label">
                      Тип формации <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Выберите тип формации</option>
                                      {unitTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="factionId" className="form-label">
                    Фракция <span className="text-danger">*</span>
                  </label>
                                     <select
                     className="form-select"
                     id="factionId"
                     name="factionId"
                     value={formData.factionId}
                     onChange={handleInputChange}
                     required
                                             disabled={isLoading || isLoadingFactions}
                   >
                                     <option value="">
                  {isLoadingFactions ? 'Загрузка фракций...' : 
                   campaignFactions.length === 0 ? 'Нет доступных фракций' : 
                   'Выберите фракцию'}
                </option>
                     {campaignFactions.map(faction => (
                       <option key={faction.id} value={faction.id}>
                         {faction.name}
                       </option>
                     ))}
                   </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Описание
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Дополнительная информация о формации..."
                    disabled={isLoading}
                  />
                </div>
                
                                                   {campaignFactions.length === 0 && !isLoadingFactions && (
                    <div className="alert alert-warning">
                      <h6 className="alert-heading">⚠️ Внимание</h6>
                      <p className="mb-0">
                        В данной кампании не зафиксированы фракции. 
                        Для создания формации необходимо, чтобы в кампании были зафиксированы фракции.
                      </p>
                    </div>
                  )}
                 
                                   <div className="alert alert-info">
                    <h6 className="alert-heading">ℹ️ Информация о типах формаций</h6>
                    <ul className="mb-0">
                      <li><strong>Лэнс:</strong> Базовая тактическая единица из 4 юнитов</li>
                      <li><strong>Рота:</strong> Состоит из 3 лэнсов (12 юнитов)</li>
                      <li><strong>Дивизия:</strong> Состоит из нескольких рот (40 юнитов)</li>
                    </ul>
                  </div>
              </div>
              
              <div className="modal-footer">
                <Button 
                  variant="secondary" 
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                                 <Button 
                   variant="primary" 
                   type="submit"
                   disabled={isLoading || isLoadingFactions || campaignFactions.length === 0}
                 >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ms-2">Создание...</span>
                    </>
                  ) : (
                    'Создать формацию'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationModal;
