import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { generatePilot, regeneratePilot, clearGeneratedPilot } from '@/store/slices/pilotSlice';
import type { Gender, GeneratedPilotData } from '@/types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import FactionSelector from './FactionSelector';

interface PilotGeneratorProps {
  onPilotGenerated?: (pilot: GeneratedPilotData) => void;
  className?: string;
}

const PilotGenerator: React.FC<PilotGeneratorProps> = ({ 
  onPilotGenerated,
  className = '' 
}) => {
  const { factions } = useAppSelector((state) => state.factions);
  const [selectedFactionId, setSelectedFactionId] = useState<number>(
    factions.length > 0 ? factions[0].id : 1
  );
  const dispatch = useAppDispatch();
  const { generatedPilot, isGenerating, error } = useAppSelector((state) => state.pilots);
  
  const [selectedGender, setSelectedGender] = useState<Gender | 'random'>('random');

  const handleGenerate = async () => {
    const gender = selectedGender === 'random' ? undefined : selectedGender;
    
    try {
      const result = await dispatch(generatePilot({ 
        factionId: selectedFactionId, 
        gender 
      })).unwrap();
      
      if (onPilotGenerated) {
        onPilotGenerated(result);
      }
    } catch (error) {
      console.error('Ошибка генерации пилота:', error);
    }
  };

  const handleRegenerate = async () => {
    if (!generatedPilot) return;
    
    try {
      const result = await dispatch(regeneratePilot({ 
        factionId: selectedFactionId, 
        currentGender: generatedPilot.gender as Gender
      })).unwrap();
      
      if (onPilotGenerated) {
        onPilotGenerated(result);
      }
    } catch (error) {
      console.error('Ошибка перегенерации пилота:', error);
    }
  };

  const handleClear = () => {
    dispatch(clearGeneratedPilot());
  };

  const getGenderIcon = (gender: Gender) => {
    return gender === 'male' ? '👨' : '👩';
  };

  const getGenderLabel = (gender: Gender) => {
    return gender === 'male' ? 'Мужчина' : 'Женщина';
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h3 className="h5 text-dark mb-3">
          Генератор пилотов
        </h3>
      
        {/* Выбор фракции */}
        <FactionSelector
          selectedFactionId={selectedFactionId}
          onFactionChange={setSelectedFactionId}
        />
      
        {/* Выбор пола */}
        <div className="mb-3">
          <label className="form-label">
            Пол пилота:
          </label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                type="radio"
                name="gender"
                value="random"
                checked={selectedGender === 'random'}
                onChange={(e) => setSelectedGender(e.target.value as Gender | 'random')}
                className="form-check-input"
              />
              <label className="form-check-label">🎲 Случайно</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={selectedGender === 'male'}
                onChange={(e) => setSelectedGender(e.target.value as Gender | 'random')}
                className="form-check-input"
              />
              <label className="form-check-label">👨 Мужчина</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={(e) => setSelectedGender(e.target.value as Gender | 'random')}
                className="form-check-input"
              />
              <label className="form-check-label">👩 Женщина</label>
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="d-flex gap-3 mb-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-fill"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="me-2" />
                Генерация...
              </>
            ) : (
              '🎲 Сгенерировать пилота'
            )}
          </Button>
          
          {generatedPilot && (
            <Button
              variant="secondary"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex-fill"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="me-2" />
                  Перегенерация...
                </>
              ) : (
                '🔄 Перегенерировать'
              )}
            </Button>
          )}
        </div>

        {/* Отображение ошибки */}
        {error && (
          <div className="alert alert-danger mb-3">
            <p className="mb-0">{error}</p>
          </div>
        )}

        {/* Результат генерации */}
        {generatedPilot && (
          <div className="card bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="h6 text-dark mb-0">
                  Сгенерированный пилот
                </h4>
                <button
                  onClick={handleClear}
                  className="btn-close"
                  title="Очистить"
                >
                </button>
              </div>
              
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">{getGenderIcon(generatedPilot.gender as Gender)}</span>
                  <span className="fw-medium text-dark">
                    {generatedPilot.firstName} {generatedPilot.lastName}
                  </span>
                  <small className="text-muted">
                    ({getGenderLabel(generatedPilot.gender as Gender)})
                  </small>
                </div>
                
                <div className="small text-muted mb-1">
                  <span className="fw-medium">Позывной:</span> "{generatedPilot.callsign}"
                </div>
                
                <div className="small text-muted">
                  <span className="fw-medium">Полное имя:</span> {generatedPilot.fullName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PilotGenerator;
