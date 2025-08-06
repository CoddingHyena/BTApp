import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useGetFactionsQuery, useDeleteFactionMutation, useGetGamesQuery } from '../store/api/apiSlice';
import { Faction } from '../types/faction';
import FactionForm from '../components/FactionForm';
import FactionCard from '../components/FactionCard';

const FactionManagementPage: React.FC = () => {
  const { data: factions, isLoading, isError, error, status, refetch } = useGetFactionsQuery();
  const { data: games } = useGetGamesQuery();
  const [deleteFaction] = useDeleteFactionMutation();
  const [storedFactions, setStoredFactions] = useState<Faction[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [deletingFaction, setDeletingFaction] = useState<Faction | null>(null);
  const [majorFilter, setMajorFilter] = useState<string>('all'); // 'all', 'major', 'minor'
  const [gameFilter, setGameFilter] = useState<string>('all'); // 'all', 'battletech', 'trench-crusade'

  useEffect(() => {
    if (factions && games) {
      let filteredFactions = factions;
      
      // Применяем фильтр по типу фракции
      if (majorFilter === 'major') {
        filteredFactions = factions.filter(faction => faction.isMajor);
      } else if (majorFilter === 'minor') {
        filteredFactions = factions.filter(faction => !faction.isMajor);
      }
      
      // Применяем фильтр по игре
      if (gameFilter === 'battletech') {
        const battletechGame = games.find(game => game.name === 'Battletech');
        if (battletechGame) {
          filteredFactions = filteredFactions.filter(faction => 
            faction.gameIdRef === battletechGame.id
          );
        }
      } else if (gameFilter === 'trench-crusade') {
        const trenchCrusadeGame = games.find(game => game.name === 'Trench Crusade');
        if (trenchCrusadeGame) {
          filteredFactions = filteredFactions.filter(faction => 
            faction.gameIdRef === trenchCrusadeGame.id
          );
        }
      }
      
      setStoredFactions(filteredFactions);
    }
  }, [factions, games, majorFilter, gameFilter]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch(); // Обновляем данные после создания
  };

  const handleEditSuccess = () => {
    setEditingFaction(null);
    refetch(); // Обновляем данные после редактирования
  };

  const handleImageUploaded = () => {
    console.log('handleImageUploaded called, will refetch data in 1 second');
    // Добавляем небольшую задержку, чтобы дать время базе данных обновиться
    setTimeout(() => {
      console.log('Refetching data after image upload');
      refetch(); // Обновляем данные после загрузки изображения
    }, 1000);
  };

  const handleDelete = async () => {
    if (deletingFaction) {
      try {
        await deleteFaction(deletingFaction.id).unwrap();
        setDeletingFaction(null);
        refetch(); // Обновляем данные после удаления
      } catch (err) {
        console.error('Error deleting faction:', err);
      }
    }
  };

  const handleEdit = (faction: Faction) => {
    setEditingFaction(faction);
  };

  const handleDeleteClick = (faction: Faction) => {
    setDeletingFaction(faction);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMajorFilter(e.target.value);
  };

  const handleGameFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameFilter(e.target.value);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (isError && storedFactions.length === 0) {
      return (
        <Alert variant="danger">
          Error loading factions: {error?.toString() || 'Unknown error'}
        </Alert>
      );
    }
    
    if (storedFactions.length === 0) {
      return (
        <Alert variant="info">
          No factions found. Create your first faction to get started.
        </Alert>
      );
    }
    
    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {storedFactions.map((faction) => (
          <Col key={faction.id}>
            <FactionCard 
              faction={faction}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">Faction Management</h1>
          <p className="text-muted mb-0">
            Manage BattleTech factions, their details, and visual assets.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
        >
          Create New Faction
        </Button>
      </div>

      {/* Фильтр по типу фракции */}
      <div className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Faction Type</Form.Label>
              <Form.Select 
                value={majorFilter} 
                onChange={handleFilterChange}
              >
                <option value="all">Все фракции</option>
                <option value="major">Ведущие Фракции</option>
                <option value="minor">Подфракция</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Game</Form.Label>
              <Form.Select 
                value={gameFilter} 
                onChange={handleGameFilterChange}
              >
                <option value="all">Все игры</option>
                <option value="battletech">Battletech</option>
                <option value="trench-crusade">Trench Crusade</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>
      
      {renderContent()}
      
      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Faction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FactionForm 
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
            onImageUploaded={handleImageUploaded}
          />
        </Modal.Body>
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        show={!!editingFaction}
        onHide={() => setEditingFaction(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Faction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingFaction && (
            <FactionForm 
              faction={editingFaction}
              onCancel={() => setEditingFaction(null)}
              onImageUploaded={handleImageUploaded}
              onSuccess={handleEditSuccess}
            />
          )}
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        show={!!deletingFaction} 
        onHide={() => setDeletingFaction(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{deletingFaction?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingFaction(null)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FactionManagementPage; 