import React, { useState } from 'react';
import { api } from '@/services/api';
import Button from '@/components/Button';
import { getMissionDescription } from '@/utils/missionDescriptions';
import { getBattlefieldConditionDescription } from '@/utils/battlefieldConditions';
import { getWeatherConditionDescription } from '@/utils/weatherConditions';

interface GeneratedMission {
  code: string;
  title: string;
  description?: string;
  objectives: string[];
  type: string;
  difficulty: string;
  cost?: number;
  reward?: Record<string, any>;
  deploymentUrl?: string;
  source?: string;
  generatedAt: string;
  isEven: boolean;
  blockMessage: string;
  battlefieldCondition: string;
  weatherConditions: string[];
}

const MissionsPage: React.FC = () => {
  const [generatedMission, setGeneratedMission] = useState<GeneratedMission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.missions.generate();
      setGeneratedMission(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при генерации миссии');
      console.error('Failed to generate mission:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 text-dark">
            Миссии
          </h1>
          <p className="text-muted">
            Конструктор миссий
          </p>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="d-flex align-items-center">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Генерация...
            </span>
          ) : (
            '🎲 Сгенерировать миссию'
          )}
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {generatedMission && (
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="h5 mb-0">Сгенерированная миссия</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h4 className="h5 text-dark mb-2">{generatedMission.title}</h4>
                <p className="text-muted mb-1">
                  <strong>Тип:</strong> {generatedMission.type}
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted mb-1">
                  <strong>Условие поля боя:</strong> {generatedMission.battlefieldCondition}
                </p>
                <p className="text-muted mb-1">
                  <strong>Погодные условия:</strong>{' '}
                  {generatedMission.weatherConditions && generatedMission.weatherConditions.length > 0
                    ? (generatedMission.weatherConditions.length === 1 && generatedMission.weatherConditions[0] === 'НЕТ'
                        ? 'НЕТ'
                        : generatedMission.weatherConditions.join(', '))
                    : 'Не определены'}
                </p>
              </div>
            </div>

            {/* Блок с описанием миссии */}
            <div className="mb-3 pt-3 border-top">
              <h5 className="h6 text-dark mb-2">Описание миссии</h5>
              <div className="bg-light p-3 rounded">
                <pre className="mb-0 text-muted" style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordWrap: 'break-word',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {getMissionDescription(generatedMission.title)}
                </pre>
              </div>
            </div>

            {/* Блок с описанием условия поля боя */}
            <div className="mb-3 pt-3 border-top">
              <h5 className="h6 text-dark mb-2">
                Условие поля боя:{' '}
                {generatedMission.battlefieldCondition === 'Battlefield Conditions' &&
                 generatedMission.weatherConditions &&
                 generatedMission.weatherConditions.length > 0 &&
                 generatedMission.weatherConditions[0] !== 'НЕТ'
                  ? `Battlefield Conditions: ${generatedMission.weatherConditions[0]}`
                  : generatedMission.battlefieldCondition}
              </h5>
              <div className="bg-light p-3 rounded">
                <pre className="mb-0 text-muted" style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordWrap: 'break-word',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {generatedMission.battlefieldCondition === 'Battlefield Conditions' &&
                   generatedMission.weatherConditions &&
                   generatedMission.weatherConditions.length > 0 &&
                   generatedMission.weatherConditions[0] !== 'НЕТ'
                    ? getWeatherConditionDescription(generatedMission.weatherConditions[0])
                    : getBattlefieldConditionDescription(generatedMission.battlefieldCondition)}
                </pre>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top">
              <small className="text-muted">
                Сгенерировано: {new Date(generatedMission.generatedAt).toLocaleString('ru-RU')}
              </small>
            </div>
          </div>
        </div>
      )}

      {!generatedMission && !isLoading && !error && (
        <div className="text-center py-5 text-muted">
          <div className="display-4 mb-3">🎯</div>
          <h4 className="h5 mb-2">Конструктор миссий</h4>
          <p>Нажмите кнопку "Сгенерировать миссию" для создания случайной миссии</p>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;

