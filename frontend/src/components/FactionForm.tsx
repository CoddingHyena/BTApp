import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useCreateFactionMutation, useUpdateFactionMutation, useGetGamesQuery } from '../store/api/apiSlice';
import { CreateFactionDto, UpdateFactionDto, Faction } from '../types/faction';
import { Game } from '../types/game';

interface FactionFormProps {
  faction?: Faction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FactionForm: React.FC<FactionFormProps> = ({ faction, onSuccess, onCancel }) => {
  const isEditing = !!faction;
  
  const [formData, setFormData] = useState<CreateFactionDto>({
    name: faction?.name || '',
    code: faction?.code || '',
    primaryColor: faction?.primaryColor || '#FFD700',
    secondaryColor: faction?.secondaryColor || '#000080',
    formationYear: faction?.formationYear || 2571,
    dissolutionYear: faction?.dissolutionYear,
    description: faction?.description || '',
    logoUrl: faction?.logoUrl || '',
    bannerUrl: faction?.bannerUrl || '',
    gameIdRef: faction?.gameIdRef || '',
    isMajor: faction?.isMajor || false,
    isActive: faction?.isActive ?? true,
  });

  const [createFaction, { isLoading: isCreating, error: createError }] = useCreateFactionMutation();
  const [updateFaction, { isLoading: isUpdating, error: updateError }] = useUpdateFactionMutation();
  const { data: games } = useGetGamesQuery();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && faction) {
        await updateFaction({ id: faction.id, ...formData }).unwrap();
      } else {
        await createFaction(formData).unwrap();
      }
      onSuccess?.();
    } catch (err) {
      console.error('Error saving faction:', err);
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

  return (
    <Card className="faction-form-card">
      <Card.Header>
        <h3>{isEditing ? 'Edit Faction' : 'Create New Faction'}</h3>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Federated Suns"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Code *</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  placeholder="FS"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primary Color</Form.Label>
                <Form.Control
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Secondary Color</Form.Label>
                <Form.Control
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Formation Year</Form.Label>
                <Form.Control
                  type="number"
                  name="formationYear"
                  value={formData.formationYear}
                  onChange={handleInputChange}
                  min="2000"
                  max="4000"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dissolution Year (optional)</Form.Label>
                <Form.Control
                  type="number"
                  name="dissolutionYear"
                  value={formData.dissolutionYear || ''}
                  onChange={handleInputChange}
                  min="2000"
                  max="4000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description of the faction..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Logo URL</Form.Label>
                <Form.Control
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Banner URL</Form.Label>
                <Form.Control
                  type="url"
                  name="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/banner.jpg"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isMajor"
                  checked={formData.isMajor}
                  onChange={handleInputChange}
                  label="Major Faction"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  label="Active"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Game</Form.Label>
                <Form.Select
                  name="gameIdRef"
                  value={formData.gameIdRef}
                  onChange={handleInputChange}
                >
                  <option value="">Select Game</option>
                  {games?.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

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
                isEditing ? 'Update Faction' : 'Create Faction'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FactionForm; 