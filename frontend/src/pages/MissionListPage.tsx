import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetMissionsQuery, useCreateMissionMutation, useDeleteMissionMutation } from '../store/api/apiSlice';
import { Mission, MissionType, MissionDifficulty } from '../types/mission';
import ImageUpload from '../components/ImageUpload';

const MissionListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    objectives: [''],
    type: MissionType.CLASSIC,
    difficulty: MissionDifficulty.MEDIUM,
    cost: 0,
    deploymentUrl: '',
    source: '',
    isOfficial: true,
  });

  const { data: missions = [], isLoading, error } = useGetMissionsQuery();
  const [createMission, { isLoading: isCreating }] = useCreateMissionMutation();
  const [deleteMission, { isLoading: isDeleting }] = useDeleteMissionMutation();

  const handleCreateMission = async () => {
    try {
      const missionData = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim() !== ''),
        cost: formData.cost || 0,
      };
      
      await createMission(missionData).unwrap();
      setShowCreateModal(false);
      setFormData({
        code: '',
        title: '',
        description: '',
        objectives: [''],
        type: MissionType.CLASSIC,
        difficulty: MissionDifficulty.MEDIUM,
        cost: 0,
        deploymentUrl: '',
        source: '',
        isOfficial: true,
      });
    } catch (error) {
      console.error('Failed to create mission:', error);
    }
  };

  const handleDeleteMission = async () => {
    if (missionToDelete) {
      try {
        await deleteMission(missionToDelete.id).unwrap();
        setShowDeleteModal(false);
        setMissionToDelete(null);
      } catch (error) {
        console.error('Failed to delete mission:', error);
      }
    }
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ''],
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj),
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
          Ошибка загрузки миссий: {error.toString()}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Миссии</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            disabled={isCreating}
          >
            {isCreating ? 'Создание...' : 'Создать миссию'}
          </Button>
        </Col>
      </Row>

      <Row>
        {missions.map((mission) => (
          <Col key={mission.id} lg={4} md={6} className="mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-0">{mission.code}</h6>
                  <small className="text-muted">{mission.title}</small>
                </div>
                <div>
                  <Badge bg={getTypeColor(mission.type)} className="me-1">
                    {mission.type === MissionType.CLASSIC ? 'Классика' : 'Alpha Strike'}
                  </Badge>
                  <Badge bg={getDifficultyColor(mission.difficulty)}>
                    {mission.difficulty === MissionDifficulty.EASY ? 'Легкая' :
                     mission.difficulty === MissionDifficulty.MEDIUM ? 'Средняя' : 'Сложная'}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                {mission.description && (
                  <p className="card-text small text-muted mb-2">
                    {mission.description.length > 100 
                      ? `${mission.description.substring(0, 100)}...` 
                      : mission.description}
                  </p>
                )}
                <div className="mb-2">
                  <strong>Цели:</strong>
                  <ul className="small mb-0">
                    {mission.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                    {mission.objectives.length > 2 && (
                      <li className="text-muted">... и еще {mission.objectives.length - 2}</li>
                    )}
                  </ul>
                </div>
                {mission.cost && mission.cost > 0 && (
                  <p className="card-text small">
                    <strong>Стоимость:</strong> {mission.cost} WP
                  </p>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {mission.isOfficial ? 'Официальная' : 'Пользовательская'}
                  </small>
                  <div>
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      onClick={() => navigate(`/missions/${mission.id}`)}
                    >
                      Просмотр
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger" 
                      className="ms-1"
                      onClick={() => {
                        setMissionToDelete(mission);
                        setShowDeleteModal(true);
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Mission Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Создать новую миссию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Код миссии *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="BT-101"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Название *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Название миссии"
                    value={formData.title}
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
                    value={formData.type}
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
                    value={formData.difficulty}
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
                placeholder="Описание миссии"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дополнительные цели *</Form.Label>
              {formData.objectives.map((objective, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder={`Цель ${index + 1}`}
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                  />
                  {formData.objectives.length > 1 && (
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
                    placeholder="0"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Официальная миссия"
                    checked={formData.isOfficial}
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
                placeholder="Total Warfare, p.102"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateMission}
            disabled={!formData.code || !formData.title || formData.objectives.every(obj => !obj.trim())}
          >
            {isCreating ? 'Создание...' : 'Создать'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить миссию "{missionToDelete?.title}" ({missionToDelete?.code})?
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

export default MissionListPage; 