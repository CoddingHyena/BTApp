import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetMechsQuery } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  selectFilteredMechs,
  selectMechFilters,
  setFilter,
  clearFilters,
  setMechs,
} from '../store/slices/mechSlice';

const MechListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get mechs from RTK Query
  const {
    data: mechs,
    isLoading,
    isError,
    error,
  } = useGetMechsQuery();
  
  // Временное решение: моковые данные для разработки, пока API не готов
  useEffect(() => {
    if (isError && import.meta.env.DEV) {
      console.log('Using mock data for development');
      const mockMechs = [
        {
          id: '1',
          dbId: 'TDR-5S',
          name: 'Thunderbolt TDR-5S',
          unitType: 'BattleMech',
          technology: 'Inner Sphere',
          chassis: 'Thunderbolt',
          era: 'Succession Wars',
          year: 2781,
          rulesLevel: 1,
          tonnage: 65,
          battleValue: 1542,
          pointValue: 31,
          cost: 6340000,
          rating: 'D',
          designer: 'Earthwerks Incorporated',
          rawMechId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          dbId: 'TBR-PRIME',
          name: 'Timber Wolf (Mad Cat) Prime',
          unitType: 'OmniMech',
          technology: 'Clan',
          chassis: 'Timber Wolf',
          era: 'Clan Invasion',
          year: 2945,
          rulesLevel: 2,
          tonnage: 75,
          battleValue: 2731,
          pointValue: 55,
          cost: 24950000,
          rating: 'A',
          designer: 'Clan Wolf',
          rawMechId: '2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          dbId: 'STG-3R',
          name: 'Stinger STG-3R',
          unitType: 'BattleMech',
          technology: 'Inner Sphere',
          chassis: 'Stinger',
          era: 'Age of War',
          year: 2479,
          rulesLevel: 1,
          tonnage: 20,
          battleValue: 520,
          pointValue: 10,
          cost: 1270000,
          rating: 'C',
          designer: 'Earthwerks Incorporated',
          rawMechId: '3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      dispatch(setMechs(mockMechs));
    }
  }, [isError, dispatch]);

  // Get filters and filtered mechs from Redux store
  const filters = useAppSelector(selectMechFilters);
  const filteredMechs = useAppSelector(selectFilteredMechs);

  // Update mechs in the store when data is loaded
  useEffect(() => {
    if (mechs) {
      dispatch(setMechs(mechs));
    }
  }, [mechs, dispatch]);

  // Handle filter changes
  // const handleFilterChange = (key: keyof typeof filters, value: any) => {
  //   dispatch(setFilter({ key, value }));
  // };

  const handleFilterChange = (
    key: keyof typeof filters, 
    value: string | number | undefined
  ) => {
    dispatch(setFilter({ key, value }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">BattleMech Database</h1>

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Header>Filters</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name, chassis..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Technology</Form.Label>
                <Form.Select
                  value={filters.technology || ''}
                  onChange={(e) => handleFilterChange('technology', e.target.value || undefined)}
                >
                  <option value="">All Technologies</option>
                  <option value="Inner Sphere">Inner Sphere</option>
                  <option value="Clan">Clan</option>
                  <option value="Mixed">Mixed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Era</Form.Label>
                <Form.Select
                  value={filters.era || ''}
                  onChange={(e) => handleFilterChange('era', e.target.value || undefined)}
                >
                  <option value="">All Eras</option>
                  <option value="Age of War">Age of War</option>
                  <option value="Star League">Star League</option>
                  <option value="Succession Wars">Succession Wars</option>
                  <option value="Clan Invasion">Clan Invasion</option>
                  <option value="Civil War">Civil War</option>
                  <option value="Jihad">Jihad</option>
                  <option value="Dark Age">Dark Age</option>
                  <option value="ilClan">ilClan</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Tonnage</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      min={20}
                      max={200}
                      value={filters.tonnageMin || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'tonnageMin',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      min={20}
                      max={200}
                      value={filters.tonnageMax || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'tonnageMax',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="secondary" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Card.Body>
      </Card>

      {/* Error handling */}
      {isError && (
        <Alert variant="danger">
          Error loading mechs: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isError && (
        <p>
          Showing {filteredMechs.length} of {mechs?.length || 0} mechs
        </p>
      )}

      {/* Mech List */}
      <Row xs={1} md={2} xl={3} className="g-4">
        {filteredMechs.map((mech) => (
          <Col key={mech.id}>
            <Card
              className="h-100 mech-card"
              onClick={() => navigate(`/mechs/${mech.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title>{mech.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {mech.chassis} - {mech.tonnage} tons
                </Card.Subtitle>
                <Card.Text>
                  <strong>Technology:</strong> {mech.technology}
                  <br />
                  <strong>Era:</strong> {mech.era}
                  <br />
                  <strong>Year:</strong> {mech.year}
                  <br />
                  <strong>BV:</strong> {mech.battleValue}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                {mech.designer ? `Designed by: ${mech.designer}` : 'Unknown designer'}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No results message */}
      {!isLoading && !isError && filteredMechs.length === 0 && (
        <Alert variant="info" className="my-3">
          No mechs found matching the current filters. Try adjusting your search criteria.
        </Alert>
      )}
    </Container>
  );
};

export default MechListPage;