import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useGetFactionsQuery, useDeleteFactionMutation } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  selectAllFactions,
  setFactions,
  selectFactionsStatus
} from '../store/slices/factionSlice';
import FactionForm from '../components/FactionForm';
import { Faction } from '../types/faction';

const FactionManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [deletingFaction, setDeletingFaction] = useState<Faction | null>(null);
  
  // Get factions from RTK Query
  const {
    data: factions,
    isLoading,
    isError,
    error,
    refetch
  } = useGetFactionsQuery();
  
  // Get factions from Redux store
  const storedFactions = useAppSelector(selectAllFactions);
  const status = useAppSelector(selectFactionsStatus);
  
  const [deleteFaction, { isLoading: isDeleting }] = useDeleteFactionMutation();
  
  // Update factions in the store when data is loaded
  React.useEffect(() => {
    if (factions) {
      dispatch(setFactions(factions));
    }
  }, [factions, dispatch]);
  
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };
  
  const handleEditSuccess = () => {
    setEditingFaction(null);
    refetch();
  };
  
  const handleDelete = async () => {
    if (deletingFaction) {
      try {
        await deleteFaction(deletingFaction.id).unwrap();
        setDeletingFaction(null);
        refetch();
      } catch (err) {
        console.error('Error deleting faction:', err);
      }
    }
  };
  
  const renderFactionCard = (faction: Faction) => (
    <Col key={faction.id} xs={12} md={6} lg={4}>
      <Card className="h-100 faction-card">
        {faction.bannerUrl && (
          <Card.Img 
            variant="top" 
            src={faction.bannerUrl}
            alt={`${faction.name} banner`}
            style={{ height: '140px', objectFit: 'cover' }}
          />
        )}
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            {faction.logoUrl && (
              <img 
                src={faction.logoUrl} 
                alt={`${faction.name} logo`}
                className="me-3"
                style={{ width: '40px', height: '40px' }}
              />
            )}
            <Card.Title>{faction.name}</Card.Title>
          </div>
          <Card.Subtitle className="mb-2 text-muted">{faction.code}</Card.Subtitle>
          <Card.Text>{faction.description}</Card.Text>
          <div className="faction-colors d-flex mb-2">
            <div 
              className="color-box me-2" 
              style={{
                backgroundColor: faction.primaryColor,
                width: '20px',
                height: '20px',
                border: '1px solid #ddd'
              }}
            />
            <div 
              className="color-box" 
              style={{
                backgroundColor: faction.secondaryColor,
                width: '20px',
                height: '20px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          <div className="mb-2">
            <span className={`badge ${faction.isMajor ? 'bg-primary' : 'bg-secondary'} me-2`}>
              {faction.isMajor ? 'Major' : 'Minor'}
            </span>
            <span className={`badge ${faction.isActive ? 'bg-success' : 'bg-danger'}`}>
              {faction.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          Formed: {faction.formationYear}
          {faction.dissolutionYear && ` - Dissolved: ${faction.dissolutionYear}`}
        </Card.Footer>
        <Card.Footer>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setEditingFaction(faction)}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setDeletingFaction(faction)}
            >
              Delete
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
  
  const renderContent = () => {
    if (isLoading && status === 'loading') {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (isError && status === 'failed' && storedFactions.length === 0) {
      return (
        <Alert variant="danger">
          Error loading factions: {error instanceof Error ? error.message : 'Unknown error'}
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
      <Row className="g-4">
        {storedFactions.map(renderFactionCard)}
      </Row>
    );
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Faction Management</h1>
          <p className="lead mb-0">
            Manage BattleTech factions. Create, edit, and delete factions.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
        >
          Create New Faction
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
          <Modal.Title>Create New Faction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FactionForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        show={!!editingFaction} 
        onHide={() => setEditingFaction(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Faction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingFaction && (
            <FactionForm 
              faction={editingFaction} 
              onSuccess={handleEditSuccess} 
              onCancel={() => setEditingFaction(null)} 
            />
          )}
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={!!deletingFaction} 
        onHide={() => setDeletingFaction(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the faction "{deletingFaction?.name}"? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingFaction(null)}>
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
              'Delete Faction'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FactionManagementPage; 