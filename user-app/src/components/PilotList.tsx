import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deletePilot } from '@/store/slices/pilotSlice';
import type { Pilot, Gender } from '@/types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface PilotListProps {
  pilots: Pilot[];
  onEditPilot?: (pilot: Pilot) => void;
  onSelectPilot?: (pilot: Pilot) => void;
  showActions?: boolean;
  className?: string;
}

const PilotList: React.FC<PilotListProps> = ({ 
  pilots, 
  onEditPilot, 
  onSelectPilot,
  showActions = true,
  className = '' 
}) => {
  const dispatch = useAppDispatch();
  const [filterGender, setFilterGender] = useState<Gender | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeletePilot = async (pilotId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пилота?')) {
      try {
        await dispatch(deletePilot(pilotId)).unwrap();
      } catch (error) {
        console.error('Ошибка удаления пилота:', error);
      }
    }
  };

  const getGenderIcon = (gender: Gender) => {
    return gender === 'MALE' ? '👨' : '👩';
  };

  const getGenderLabel = (gender: Gender) => {
    return gender === 'MALE' ? 'Мужчина' : 'Женщина';
  };

  const getSkillColor = (skill: number) => {
    if (skill <= 3) return 'text-success';
    if (skill <= 5) return 'text-warning';
    return 'text-danger';
  };

  // Фильтрация пилотов
  const filteredPilots = pilots.filter(pilot => {
    const matchesGender = filterGender === 'all' || 
      (filterGender === 'male' && pilot.gender === 'MALE') ||
      (filterGender === 'female' && pilot.gender === 'FEMALE');
    
    const matchesSearch = searchTerm === '' || 
      pilot.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.callsign.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesGender && matchesSearch;
  });

  if (pilots.length === 0) {
    return (
      <div className={`text-center py-5 text-muted ${className}`}>
        <div className="display-4 mb-3">👨‍✈️</div>
        <h4 className="h5 mb-2">Нет пилотов</h4>
        <p>Добавьте пилотов для начала кампании</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Фильтры и поиск */}
      <div className="mb-4">
        <div className="row g-3 mb-3">
          {/* Поиск */}
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Поиск по имени или позывному..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          
          {/* Фильтр по полу */}
          <div className="col-md-4">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as Gender | 'all')}
              className="form-select"
            >
              <option value="all">Все пилоты</option>
              <option value="male">👨 Мужчины</option>
              <option value="female">👩 Женщины</option>
            </select>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="d-flex gap-3 small text-muted">
          <span>Всего: {pilots.length}</span>
          <span>Мужчин: {pilots.filter(p => p.gender === 'MALE').length}</span>
          <span>Женщин: {pilots.filter(p => p.gender === 'FEMALE').length}</span>
          <span>Показано: {filteredPilots.length}</span>
        </div>
      </div>

      {/* Список пилотов */}
      <div>
        {filteredPilots.map((pilot) => (
          <div
            key={pilot.id}
            className="card mb-3 shadow-sm"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  {/* Аватар и пол */}
                  <div className="text-center">
                    <span className="fs-2">{getGenderIcon(pilot.gender)}</span>
                    <div className="small text-muted">
                      {getGenderLabel(pilot.gender)}
                    </div>
                  </div>
                  
                  {/* Информация о пилоте */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h4 className="h6 text-dark mb-0">
                        {pilot.firstName} {pilot.lastName}
                      </h4>
                      <small className="text-muted">
                        "{pilot.callsign}"
                      </small>
                    </div>
                    
                    {/* Навыки */}
                    <div className="d-flex gap-3 small">
                      <span>
                        <span className="text-muted">Стрельба:</span>
                        <span className={`ms-1 fw-medium ${getSkillColor(pilot.gunnery)}`}>
                          {pilot.gunnery}
                        </span>
                      </span>
                      <span>
                        <span className="text-muted">Пилотирование:</span>
                        <span className={`ms-1 fw-medium ${getSkillColor(pilot.piloting)}`}>
                          {pilot.piloting}
                        </span>
                      </span>
                      <span>
                        <span className="text-muted">Опыт:</span>
                        <span className="ms-1 fw-medium text-primary">
                          {pilot.experience}
                        </span>
                      </span>
                    </div>
                    
                    {/* Дополнительная информация */}
                    {pilot.rank && (
                      <div className="small text-muted mt-1">
                        Звание: {pilot.rank}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Действия */}
                {showActions && (
                  <div className="d-flex gap-2">
                    {onSelectPilot && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSelectPilot(pilot)}
                      >
                        Выбрать
                      </Button>
                    )}
                    
                    {onEditPilot && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEditPilot(pilot)}
                      >
                        ✏️
                      </Button>
                    )}
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePilot(pilot.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPilots.length === 0 && pilots.length > 0 && (
        <div className="text-center py-4 text-muted">
          <p>Пилоты не найдены по заданным критериям</p>
        </div>
      )}
    </div>
  );
};

export default PilotList;
