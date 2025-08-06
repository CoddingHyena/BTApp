import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useCreateGameMutation, useUpdateGameMutation, useUploadGameIconMutation, useUploadGameBannerMutation } from '../store/api/apiSlice';
import { CreateGameDto, UpdateGameDto, Game, GameCategory } from '../types/game';
import UniversalImageUpload from './UniversalImageUpload';

interface GameFormProps {
  game?: Game;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ game, onSuccess, onCancel }) => {
  const isEditing = !!game;
  
  const [formData, setFormData] = useState<CreateGameDto>({
    name: game?.name || '',
    description: game?.description || '',
    category: game?.category || 'TACTICAL',
    iconUrl: game?.iconUrl || '',
    bannerUrl: game?.bannerUrl || '',
    isActive: game?.isActive ?? true,
    sortOrder: game?.sortOrder || 1,
  });

  const [createGame, { isLoading: isCreating, error: createError }] = useCreateGameMutation();
  const [updateGame, { isLoading: isUpdating, error: updateError }] = useUpdateGameMutation();
  const [uploadIcon] = useUploadGameIconMutation();
  const [uploadBanner] = useUploadGameBannerMutation();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  const gameCategories: GameCategory[] = ['TACTICAL', 'STRATEGIC', 'RPG', 'BOARD_GAME', 'MINIATURES'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && game) {
        await updateGame({ id: game.id, ...formData }).unwrap();
      } else {
        await createGame(formData).unwrap();
      }
      onSuccess?.();
    } catch (err) {
      console.error('Error saving game:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? Number(value) : 
               value,
    }));
  };

  const handleIconUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, iconUrl: imageUrl }));
  };

  const handleBannerUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, bannerUrl: imageUrl }));
  };

  return (
    <Card className="game-form-card">
      <Card.Header>
        <h3>{isEditing ? 'Edit Game' : 'Create New Game'}</h3>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="BattleTech"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sort Order *</Form.Label>
                <Form.Control
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="1000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {gameCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description of the game..."
            />
          </Form.Group>

          {/* Загрузка изображений */}
          <Row>
            <Col md={6}>
              <UniversalImageUpload
                uploadFunction={uploadIcon}
                uploadType="game-icon"
                onImageUploaded={handleIconUpload}
                currentImageUrl={formData.iconUrl}
                label="Иконка игры"
              />
            </Col>
            <Col md={6}>
              <UniversalImageUpload
                uploadFunction={uploadBanner}
                uploadType="game-banner"
                onImageUploaded={handleBannerUpload}
                currentImageUrl={formData.bannerUrl}
                label="Баннер игры"
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              label="Active Game"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Game' : 'Create Game'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GameForm; 