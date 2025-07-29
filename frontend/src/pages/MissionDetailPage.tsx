import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Modal } from 'react-bootstrap';
import { useGetMissionByIdQuery, useUpdateMissionMutation, useDeleteMissionMutation } from '../store/api/apiSlice';
import { Mission, MissionType, MissionDifficulty } from '../types/mission';
import ImageUpload from '../components/ImageUpload';
import { getImageUrl } from '../config/api';

const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Mission>>({});

  const { data: mission, isLoading, error } = useGetMissionByIdQuery(id!);
  const [updateMission, { isLoading: isUpdating }] = useUpdateMissionMutation();
  const [deleteMission, { isLoading: isDeleting }] = useDeleteMissionMutation();

  useEffect(() => {
    if (mission) {
      setFormData({
        code: mission.code,
        title: mission.title,
        description: mission.description || '',
        objectives: [...mission.objectives],
        type: mission.type,
        difficulty: mission.difficulty,
        cost: mission.cost || 0,
        deploymentUrl: mission.deploymentUrl || '',
        source: mission.source || '',
        isOfficial: mission.isOfficial,
      });
    }
  }, [mission]);

  const handleUpdateMission = async () => {
    if (!id) return;
    
    try {
      await updateMission({
        id,
        ...formData,
        objectives: formData.objectives?.filter(obj => obj.trim() !== '') || [],
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update mission:', error);
    }
  };

  const handleDeleteMission = async () => {
    if (!id) return;
    
    try {
      await deleteMission(id).unwrap();
      navigate('/missions');
    } catch (error) {
      console.error('Failed to delete mission:', error);
    }
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), ''],
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.map((obj, i) => i === index ? value : obj) || [],
    }));
  };

  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case MissionDifficulty.EASY: return 'success';
      case MissionDifficulty.MEDIUM: return 'warning';
      case MissionDifficulty.HARD: return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: MissionType) => {
    switch (type) {
      case MissionType.CLASSIC: return 'primary';
      case MissionType.ALPHA_STRIKE: return 'info';
      default: return 'secondary';
    }
  };

  const getDifficultyText = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case MissionDifficulty.EASY: return 'Легкая';
      case MissionDifficulty.MEDIUM: return 'Средняя';
      case MissionDifficulty.HARD: return 'Сложная';
      default: return 'Неизвестно';
    }
  };

  const getTypeText = (type: MissionType) => {
    switch (type) {
      case MissionType.CLASSIC: return 'Классическая';
      case MissionType.ALPHA_STRIKE: return 'Alpha Strike';
      default: return 'Неизвестно';
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          Ошибка загрузки миссии: {error.toString()}
        </Alert>
      </Container>
    );
  }

  if (!mission) {
    return (
      <Container>
        <Alert variant="warning">
          Миссия не найдена
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate('/missions')}>
            ← Назад к списку
          </Button>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button 
              variant={isEditing ? "success" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={isUpdating}
            >
              {isEditing ? 'Отменить редактирование' : 'Редактировать'}
            </Button>
            {isEditing && (
              <Button 
                variant="success" 
                onClick={handleUpdateMission}
                disabled={isUpdating}
              >
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </Button>
            )}
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
            >
              Удалить
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="mb-1">{mission.title}</h3>
                  <h5 className="text-muted mb-0">{mission.code}</h5>
                </div>
                <div>
                  <Badge bg={getTypeColor(mission.type)} className="me-2">
                    {getTypeText(mission.type)}
                  </Badge>
                  <Badge bg={getDifficultyColor(mission.difficulty)}>
                    {getDifficultyText(mission.difficulty)}
                  </Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Код миссии *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.code || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Название *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Тип миссии *</Form.Label>
                        <Form.Select
                          value={formData.type || MissionType.CLASSIC}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MissionType }))}
                        >
                          <option value={MissionType.CLASSIC}>Классическая</option>
                          <option value={MissionType.ALPHA_STRIKE}>Alpha Strike</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Сложность *</Form.Label>
                        <Form.Select
                          value={formData.difficulty || MissionDifficulty.MEDIUM}
                          onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as MissionDifficulty }))}
                        >
                          <option value={MissionDifficulty.EASY}>Легкая</option>
                          <option value={MissionDifficulty.MEDIUM}>Средняя</option>
                          <option value={MissionDifficulty.HARD}>Сложная</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Дополнительные цели</Form.Label>
                    {(formData.objectives || []).map((objective, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                        />
                        {(formData.objectives || []).length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => removeObjective(index)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline-secondary" size="sm" onClick={addObjective}>
                      + Добавить цель
                    </Button>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Стоимость (WP)</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.cost || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Официальная миссия"
                          checked={formData.isOfficial || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, isOfficial: e.target.checked }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Схема расстановки</Form.Label>
                    <ImageUpload
                      onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, deploymentUrl: imageUrl }))}
                      currentImageUrl={formData.deploymentUrl}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Источник</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.source || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </Form.Group>
                </Form>
              ) : (
                <div>
                  {mission.description && (
                    <div className="mb-4">
                      <h5>Описание</h5>
                      <p>{mission.description}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5>Дополнительные цели</h5>
                    <ol>
                      {mission.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ol>
                  </div>

                  {mission.cost && mission.cost > 0 && (
                    <div className="mb-4">
                      <h5>Стоимость</h5>
                      <p className="mb-0">{mission.cost} Warchest Points</p>
                    </div>
                  )}

                  {mission.reward && (
                    <div className="mb-4">
                      <h5>Награда</h5>
                      <pre className="bg-light p-3 rounded">
                        {JSON.stringify(mission.reward, null, 2)}
                      </pre>
                    </div>
                  )}

                  {mission.deploymentUrl && (
                    <div className="mb-4">
                      <h5>Схема расстановки</h5>
                      <img 
                        src={getImageUrl(mission.deploymentUrl)} 
                        alt="Схема расстановки" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px' }}
                        onError={(e) => {
                          console.error('Failed to load image:', mission.deploymentUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {mission.source && (
                    <div className="mb-4">
                      <h5>Источник</h5>
                      <p className="mb-0">{mission.source}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5>Метаданные</h5>
                    <Row>
                      <Col md={6}>
                        <p><strong>Тип:</strong> {getTypeText(mission.type)}</p>
                        <p><strong>Сложность:</strong> {getDifficultyText(mission.difficulty)}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Статус:</strong> {mission.isOfficial ? 'Официальная' : 'Пользовательская'}</p>
                        <p><strong>Создана:</strong> {new Date(mission.createdAt).toLocaleDateString('ru-RU')}</p>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5>Информация</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>ID:</strong> {mission.id}
              </div>
              <div className="mb-3">
                <strong>Создана:</strong> {new Date(mission.createdAt).toLocaleString('ru-RU')}
              </div>
              <div className="mb-3">
                <strong>Обновлена:</strong> {new Date(mission.updatedAt).toLocaleString('ru-RU')}
              </div>
              <div className="mb-3">
                <strong>Количество целей:</strong> {mission.objectives.length}
              </div>
              {mission.cost && (
                <div className="mb-3">
                  <strong>Стоимость:</strong> {mission.cost} WP
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить миссию "{mission.title}" ({mission.code})?
          Это действие нельзя отменить.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteMission}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MissionDetailPage; 