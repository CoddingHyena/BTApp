import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useGetPeriodsQuery } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  selectAllPeriods,
  setPeriods,
  selectPeriodsStatus
} from '../store/slices/periodSlice';

const PeriodListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get periods from RTK Query
  const {
    data: periods,
    isLoading,
    isError,
    error
  } = useGetPeriodsQuery();
  
  // Get periods from Redux store
  const storedPeriods = useAppSelector(selectAllPeriods);
  const status = useAppSelector(selectPeriodsStatus);
  
  // Update periods in the store when data is loaded
  useEffect(() => {
    if (periods) {
      dispatch(setPeriods(periods));
    }
  }, [periods, dispatch]);
  
  // Временное решение: моковые данные для разработки, пока API не готов
  useEffect(() => {
    if (isError && import.meta.env.DEV) {
      console.log('Using mock period data for development');
      const mockPeriods = [
        {
          id: '1',
          name: 'Age of War',
          code: 'AW',
          startYear: 2005,
          endYear: 2570,
          sortOrder: 1,
          description: 'The Age of War was a period of interstellar conflict between various states of the Inner Sphere.',
          imageUrl: '/periods/age-of-war.jpg',
          bannerUrl: '/periods/age-of-war-banner.jpg'
        },
        {
          id: '2',
          name: 'Star League',
          code: 'SL',
          startYear: 2571,
          endYear: 2781,
          sortOrder: 2,
          description: 'The Star League Era marked a golden age for mankind, with technological and cultural heights never again achieved.',
          imageUrl: '/periods/star-league.jpg',
          bannerUrl: '/periods/star-league-banner.jpg'
        },
        {
          id: '3',
          name: 'Succession Wars',
          code: 'SW',
          startYear: 2782,
          endYear: 3050,
          sortOrder: 3,
          description: 'The Succession Wars were a series of conflicts fought between the Great Houses of the Inner Sphere over the remains of the fallen Star League.',
          imageUrl: '/periods/succession-wars.jpg',
          bannerUrl: '/periods/succession-wars-banner.jpg'
        },
        {
          id: '4',
          name: 'Clan Invasion',
          code: 'CI',
          startYear: 3050,
          endYear: 3060,
          sortOrder: 4,
          description: 'The Clan Invasion Era began when the Clans, descendants of the Star League Defense Force, returned to conquer the Inner Sphere.',
          imageUrl: '/periods/clan-invasion.jpg',
          bannerUrl: '/periods/clan-invasion-banner.jpg'
        },
        {
          id: '5',
          name: 'Civil War',
          code: 'CW',
          startYear: 3061,
          endYear: 3067,
          sortOrder: 5,
          description: 'The FedCom Civil War was a massive conflict that engulfed the Federated Commonwealth.',
          imageUrl: '/periods/civil-war.jpg',
          bannerUrl: '/periods/civil-war-banner.jpg'
        },
        {
          id: '6',
          name: 'Jihad',
          code: 'JH',
          startYear: 3068,
          endYear: 3081,
          sortOrder: 6,
          description: 'The Jihad was a massive conflict started by the Word of Blake, a splinter faction of ComStar.',
          imageUrl: '/periods/jihad.jpg',
          bannerUrl: '/periods/jihad-banner.jpg'
        },
        {
          id: '7',
          name: 'Dark Age',
          code: 'DA',
          startYear: 3082,
          endYear: 3150,
          sortOrder: 7,
          description: 'The Dark Age was characterized by technological regression following the Jihad and the collapse of the HPG network.',
          imageUrl: '/periods/dark-age.jpg',
          bannerUrl: '/periods/dark-age-banner.jpg'
        },
        {
          id: '8',
          name: 'ilClan',
          code: 'IC',
          startYear: 3151,
          endYear: 3250,
          sortOrder: 8,
          description: 'The ilClan Era began with Clan Wolf conquering Terra and establishing themselves as the new ilClan.',
          imageUrl: '/periods/ilclan.jpg',
          bannerUrl: '/periods/ilclan-banner.jpg'
        }
      ];
      dispatch(setPeriods(mockPeriods));
    }
  }, [isError, dispatch]);
  
  // Display periods from the store, or show loading/error states
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
    
    if (isError && status === 'failed' && storedPeriods.length === 0) {
      return (
        <Alert variant="danger">
          Error loading periods: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      );
    }
    
    if (storedPeriods.length === 0) {
      return (
        <Alert variant="info">
          No historical periods found. Periods will be displayed here once they're available.
        </Alert>
      );
    }
    
    return (
      <Row xs={1} md={2} className="g-4">
        {storedPeriods.map((period) => (
          <Col key={period.id}>
            <Card className="h-100 period-card">
              {period.bannerUrl && (
                <Card.Img 
                  variant="top" 
                  src={period.bannerUrl}
                  alt={`${period.name} era banner`}
                  style={{ height: '140px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{period.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {period.startYear} - {period.endYear}
                </Card.Subtitle>
                <Card.Text>{period.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                Code: {period.code}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">BattleTech Historical Eras</h1>
      <p className="lead mb-4">
        The rich history of the BattleTech universe spans over a millennium, divided into distinct eras 
        each with their own technological levels, political landscapes, and major conflicts.
      </p>
      
      {renderContent()}
    </Container>
  );
};

export default PeriodListPage;