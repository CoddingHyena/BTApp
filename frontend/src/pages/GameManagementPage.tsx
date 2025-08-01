import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner, Badge } from 'react-bootstrap';
import { useGetGamesQuery, useDeleteGameMutation } from '../store/api/apiSlice';
import GameForm from '../components/GameForm';
import { Game } from '../types/game';

const GameManagementPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);
  
  const {
    data: games,
    isLoading,
    isError,
    error,
    refetch
  } = useGetGamesQuery();
  
  const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
  
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };
  
  const handleEditSuccess = () => {
    setEditingGame(null);
    refetch();
  };
  
  const handleDelete = async () => {
    if (deletingGame) {
      try {
        await deleteGame(deletingGame.id).unwrap();
        setDeletingGame(null);
        refetch();
      } catch (err) {
        console.error('Error deleting game:', err);
      }
    }
  };
  
  const renderGameCard = (game: Game) => (
    <Col key={game.id} xs={12} md={6} lg={4}>
      <Card className="h-100 game-card">
        {game.bannerUrl && (
          <Card.Img 
            variant="top" 
            src={game.bannerUrl}
            alt={`${game.name} banner`}
            style={{ height: '140px', objectFit: 'cover' }}
          />
        )}
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            {game.iconUrl && (
              <img 
                src={game.iconUrl} 
                alt={`${game.name} icon`}
                className="me-3"
                style={{ width: '40px', height: '40px' }}
              />
            )}
            <Card.Title>{game.name}</Card.Title>
          </div>
          <Card.Text>{game.description}</Card.Text>
          <div className="mb-2">
            <Badge bg="info" className="me-2">
              {game.category}
            </Badge>
            <Badge bg={game.isActive ? 'success' : 'danger'}>
              {game.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="text-muted small">
            Sort Order: {game.sortOrder}
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setEditingGame(game)}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setDeletingGame(game)}
            >
              Delete
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
  
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
    
    if (isError) {
      return (
        <Alert variant="danger">
          Error loading games: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      );
    }
    
    if (!games || games.length === 0) {
      return (
        <Alert variant="info">
          No games found. Create your first game to get started.
        </Alert>
      );
    }
    
    return (
      <Row className="g-4">
        {games.map(renderGameCard)}
      </Row>
    );
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Game Management</h1>
          <p className="lead mb-0">
            Manage games in the system. Create, edit, and delete games.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
        >
          Create New Game
        </Button>
      </div>
      
      {renderContent()}
      
      {/* Create Modal */}
      <Modal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GameForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        show={!!editingGame} 
        onHide={() => setEditingGame(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingGame && (
            <GameForm 
              game={editingGame} 
              onSuccess={handleEditSuccess} 
              onCancel={() => setEditingGame(null)} 
            />
          )}
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={!!deletingGame} 
        onHide={() => setDeletingGame(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the game "{deletingGame?.name}"? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingGame(null)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Game'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GameManagementPage; 