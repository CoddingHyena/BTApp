import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useGetFactionsQuery } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  selectAllFactions,
  setFactions,
  selectFactionsStatus
} from '../store/slices/factionSlice';

const FactionListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get factions from RTK Query
  const {
    data: factions,
    isLoading,
    isError,
    error
  } = useGetFactionsQuery();
  
  // Get factions from Redux store
  const storedFactions = useAppSelector(selectAllFactions);
  const status = useAppSelector(selectFactionsStatus);
  
  // Update factions in the store when data is loaded
  useEffect(() => {
    if (factions) {
      dispatch(setFactions(factions));
    }
  }, [factions, dispatch]);
  
  // Временное решение: моковые данные для разработки, пока API не готов
  useEffect(() => {
    if (isError && import.meta.env.DEV) {
      console.log('Using mock faction data for development');
      const mockFactions = [
        {
          id: '1',
          name: 'Federated Suns',
          code: 'FS',
          primaryColor: '#FFD700',
          secondaryColor: '#8B0000',
          formationYear: 2317,
          description: 'The Federated Suns is one of the major Successor States of the Inner Sphere.',
          logoUrl: '/factions/fs-logo.png',
          bannerUrl: '/factions/fs-banner.jpg'
        },
        {
          id: '2',
          name: 'Clan Wolf',
          code: 'CW',
          primaryColor: '#708090',
          secondaryColor: '#FF4500',
          formationYear: 2807,
          description: 'Clan Wolf was one of the original twenty Clans founded by Nicholas Kerensky.',
          logoUrl: '/factions/cw-logo.png',
          bannerUrl: '/factions/cw-banner.jpg'
        },
        {
          id: '3',
          name: 'Capellan Confederation',
          code: 'CC',
          primaryColor: '#006400',
          secondaryColor: '#B22222',
          formationYear: 2367,
          description: 'The Capellan Confederation is the smallest of the five major Successor States of the Inner Sphere.',
          logoUrl: '/factions/cc-logo.png',
          bannerUrl: '/factions/cc-banner.jpg'
        },
        {
          id: '4',
          name: 'ComStar',
          code: 'CS',
          primaryColor: '#FFFFFF',
          secondaryColor: '#000000',
          formationYear: 2785,
          description: 'ComStar is an interstellar communications, information, and technology organization.',
          logoUrl: '/factions/cs-logo.png',
          bannerUrl: '/factions/cs-banner.jpg'
        }
      ];
      dispatch(setFactions(mockFactions));
    }
  }, [isError, dispatch]);
  
  // Display factions from the store, or show loading/error states
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
          No factions found. Factions will be displayed here once they're available.
        </Alert>
      );
    }
    
    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {storedFactions.map((faction) => (
          <Col key={faction.id}>
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
              </Card.Body>
              <Card.Footer className="text-muted">
                Formed: {faction.formationYear}
                {faction.dissolutionYear && ` - Dissolved: ${faction.dissolutionYear}`}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">BattleTech Factions</h1>
      <p className="lead mb-4">
        The BattleTech universe is populated by numerous factions vying for power, 
        resources, and territory across the stars.
      </p>
      
      {renderContent()}
    </Container>
  );
};

export default FactionListPage;