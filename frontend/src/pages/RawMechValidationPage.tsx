import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner, Badge, Table } from 'react-bootstrap';
import { useGetRawMechsPendingQuery, useValidateRawMechMutation, useDeleteRawMechMutation } from '../store/api/apiSlice';
import { RawMech } from '../types/mech';

const RawMechValidationPage: React.FC = () => {
  const [validatingMech, setValidatingMech] = useState<RawMech | null>(null);
  const [deletingMech, setDeletingMech] = useState<RawMech | null>(null);
  
  const { data: pendingMechs, isLoading, isError, error, refetch } = useGetRawMechsPendingQuery();
  const [validateRawMech, { isLoading: isValidating }] = useValidateRawMechMutation();
  const [deleteRawMech, { isLoading: isDeleting }] = useDeleteRawMechMutation();
  
  const handleValidate = async (mech: RawMech, validated: boolean) => {
    try {
      await validateRawMech({ id: mech.id, validated }).unwrap();
      setValidatingMech(null);
      refetch();
    } catch (err) {
      console.error('Failed to validate mech:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingMech) return;
    
    try {
      await deleteRawMech(deletingMech.id).unwrap();
      setDeletingMech(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete mech:', err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="danger">
          Error loading pending mechs: {error?.toString()}
        </Alert>
      );
    }

    if (!pendingMechs || pendingMechs.length === 0) {
      return (
        <Alert variant="info">
          No pending mechs for validation.
        </Alert>
      );
    }

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>DB ID</th>
            <th>Name</th>
            <th>Chassis</th>
            <th>Technology</th>
            <th>Tonnage</th>
            <th>Battle Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingMechs.map((mech) => (
            <tr key={mech.id}>
              <td>{mech.dbId}</td>
              <td>
                <strong>{mech.name}</strong>
                <br />
                <small className="text-muted">{mech.unitType}</small>
              </td>
              <td>{mech.chassis}</td>
              <td>
                <Badge bg={mech.technology === 'Clan' ? 'danger' : 'primary'}>
                  {mech.technology}
                </Badge>
              </td>
              <td>{mech.tonnage}</td>
              <td>{mech.battleValue}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={() => setValidatingMech(mech)}
                    disabled={isValidating}
                  >
                    Validate
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => setDeletingMech(mech)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Raw Mech Validation</h1>
          <p className="lead mb-0">Review and validate imported mechs before they become available in the system.</p>
        </div>
        <Button variant="outline-secondary" onClick={refetch} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>

      {renderContent()}

      {/* Validation Modal */}
      <Modal show={!!validatingMech} onHide={() => setValidatingMech(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Validate Mech</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validatingMech && (
            <div>
              <p><strong>Name:</strong> {validatingMech.name}</p>
              <p><strong>Chassis:</strong> {validatingMech.chassis}</p>
              <p><strong>Technology:</strong> {validatingMech.technology}</p>
              <p><strong>Tonnage:</strong> {validatingMech.tonnage}</p>
              <p><strong>Battle Value:</strong> {validatingMech.battleValue}</p>
              <p><strong>Point Value:</strong> {validatingMech.pointValue}</p>
              <p><strong>Year:</strong> {validatingMech.year}</p>
              <p><strong>Era:</strong> {validatingMech.era}</p>
              <p><strong>Rules Level:</strong> {validatingMech.rulesLevel}</p>
              {validatingMech.cost && <p><strong>Cost:</strong> {validatingMech.cost.toLocaleString()}</p>}
              {validatingMech.rating && <p><strong>Rating:</strong> {validatingMech.rating}</p>}
              {validatingMech.designer && <p><strong>Designer:</strong> {validatingMech.designer}</p>}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setValidatingMech(null)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={() => validatingMech && handleValidate(validatingMech, true)}
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Validating...
              </>
            ) : (
              'Validate & Create Mech'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deletingMech} onHide={() => setDeletingMech(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Raw Mech</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingMech && (
            <p>
              Are you sure you want to delete <strong>{deletingMech.name}</strong>? 
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingMech(null)}>
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
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RawMechValidationPage; 