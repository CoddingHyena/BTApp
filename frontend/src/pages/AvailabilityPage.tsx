import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Spinner, 
  Alert, Table, Badge
} from 'react-bootstrap';
import { 
  useGetMechAvailabilitiesQuery, 
  useGetFactionsQuery, 
  useGetMechsQuery,
  useGetPeriodsQuery 
} from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  selectFilteredAvailabilities,
  selectAvailabilityFilters,
  setAvailabilityFilter,
  clearAvailabilityFilters,
  setAvailabilities
} from '../store/slices/availabilitySlice';
import { MechAvailability, AvailabilityLevel } from '../types/availability';

const MechAvailabilityPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Fetch data from API
  const {
    data: availabilities,
    isLoading: isLoadingAvailabilities,
    isError: isErrorAvailabilities,
    error: errorAvailabilities
  } = useGetMechAvailabilitiesQuery();
  
  const { data: factions } = useGetFactionsQuery();
  const { data: mechs } = useGetMechsQuery();
  const { data: periods } = useGetPeriodsQuery();
  
  // Get filtered data from Redux store
  const filters = useAppSelector(selectAvailabilityFilters);
  const filteredAvailabilities = useAppSelector(selectFilteredAvailabilities);
  
  // Update availabilities in the store when data is loaded
  useEffect(() => {
    if (availabilities) {
      dispatch(setAvailabilities(availabilities));
    }
  }, [availabilities, dispatch]);
  
  // Временное решение: моковые данные для разработки, пока API не готов
  useEffect(() => {
    if (isErrorAvailabilities && import.meta.env.DEV)  {
      console.log('Using mock availability data for development');
      const mockAvailabilities = [
        {
          id: '1',
          mechId: '1', // Thunderbolt TDR-5S
          factionId: '1', // Federated Suns
          periodId: '3', // Succession Wars
          availabilityLevel: AvailabilityLevel.COMMON,
          introducedYear: 2781,
          notes: 'Standard configuration widely available across AFFS units.'
        },
        {
          id: '2',
          mechId: '1', // Thunderbolt TDR-5S
          factionId: '3', // Capellan Confederation
          periodId: '3', // Succession Wars
          availabilityLevel: AvailabilityLevel.UNCOMMON,
          introducedYear: 2785,
          notes: 'Captured examples and limited production runs.'
        },
        {
          id: '3',
          mechId: '2', // Timber Wolf Prime
          factionId: '2', // Clan Wolf
          periodId: '4', // Clan Invasion
          availabilityLevel: AvailabilityLevel.COMMON,
          introducedYear: 2945,
          notes: 'Frontline OmniMech for Clan Wolf.'
        },
        {
          id: '4',
          mechId: '2', // Timber Wolf Prime
          factionId: '1', // Federated Suns
          periodId: '4', // Clan Invasion
          availabilityLevel: AvailabilityLevel.VERY_RARE,
          introducedYear: 3050,
          notes: 'Captured during the Clan Invasion.'
        },
        {
          id: '5',
          mechId: '3', // Stinger STG-3R
          factionId: '4', // ComStar
          periodId: '3', // Succession Wars
          availabilityLevel: AvailabilityLevel.RARE,
          introducedYear: 2750,
          notes: 'Maintained in ComStar stockpiles.'
        }
      ];
      dispatch(setAvailabilities(mockAvailabilities));
    }
  }, [isErrorAvailabilities, dispatch]);
  
  // Handle filter changes
  // const handleFilterChange = (key: keyof typeof filters, value: any) => {
  //   dispatch(setAvailabilityFilter({ key, value }));
  // };

  // const handleFilterChange = (
  //   key: keyof typeof filters, 
  //   value: string | undefined
  // ) => {
  //   dispatch(setAvailabilityFilter({ key, value }));
  // };

  type FilterKey = "mechId" | "factionId" | "periodId" | "availabilityLevel";

  const handleFilterChange = (
    key: FilterKey, 
    value: string | number | undefined
  ) => {
    dispatch(setAvailabilityFilter({ key, value }));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    dispatch(clearAvailabilityFilters());
  };
  
  // Helper to get mech name by ID
  const getMechName = (mechId: string) => {
    if (!mechs) return 'Unknown Mech';
    const mech = mechs.find(m => m.id === mechId);
    return mech ? mech.name : 'Unknown Mech';
  };
  
  // Helper to get faction name by ID
  const getFactionName = (factionId: string) => {
    if (!factions) return 'Unknown Faction';
    const faction = factions.find(f => f.id === factionId);
    return faction ? faction.name : 'Unknown Faction';
  };
  
  // Helper to get period name by ID
  const getPeriodName = (periodId: string) => {
    if (!periods) return 'Unknown Period';
    const period = periods.find(p => p.id === periodId);
    return period ? period.name : 'Unknown Period';
  };
  
  // Helper to render availability level badge
  const renderAvailabilityBadge = (level: AvailabilityLevel) => {
    let variant = '';
    
    switch (level) {
      case AvailabilityLevel.COMMON:
        variant = 'success';
        break;
      case AvailabilityLevel.UNCOMMON:
        variant = 'info';
        break;
      case AvailabilityLevel.RARE:
        variant = 'primary';
        break;
      case AvailabilityLevel.VERY_RARE:
        variant = 'warning';
        break;
      case AvailabilityLevel.EXPERIMENTAL:
        variant = 'danger';
        break;
      case AvailabilityLevel.PROTOTYPE:
        variant = 'dark';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{level.replace('_', ' ')}</Badge>;
  };
  
  // Loading and error states
  const isLoading = isLoadingAvailabilities;
  const isError = isErrorAvailabilities;
  const error = errorAvailabilities;
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">BattleMech Availability Database</h1>
      <p className="lead mb-4">
        Explore which factions have access to specific BattleMechs across different eras.
      </p>
      
      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Header>Filters</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Mech</Form.Label>
                <Form.Select
                  value={filters.mechId || ''}
                  onChange={(e) => handleFilterChange('mechId', e.target.value || undefined)}
                >
                  <option value="">All Mechs</option>
                  {mechs && mechs.map(mech => (
                    <option key={mech.id} value={mech.id}>
                      {mech.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Faction</Form.Label>
                <Form.Select
                  value={filters.factionId || ''}
                  onChange={(e) => handleFilterChange('factionId', e.target.value || undefined)}
                >
                  <option value="">All Factions</option>
                  {factions && factions.map(faction => (
                    <option key={faction.id} value={faction.id}>
                      {faction.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Period</Form.Label>
                <Form.Select
                  value={filters.periodId || ''}
                  onChange={(e) => handleFilterChange('periodId', e.target.value || undefined)}
                >
                  <option value="">All Periods</option>
                  {periods && periods.map(period => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Availability Level</Form.Label>
                <Form.Select
                  value={filters.availabilityLevel || ''}
                  onChange={(e) => handleFilterChange('availabilityLevel', e.target.value || undefined)}
                >
                  <option value="">All Levels</option>
                  {Object.values(AvailabilityLevel).map(level => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ')}
                    </option>
                  ))}
                </Form.Select>
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
          Error loading availability data: {error instanceof Error ? error.message : 'Unknown error'}
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
          Showing {filteredAvailabilities.length} of {availabilities?.length || 0} availability records
        </p>
      )}
      
      {/* Availability Table */}
      {!isLoading && !isError && filteredAvailabilities.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Mech</th>
              <th>Faction</th>
              <th>Era</th>
              <th>Availability</th>
              <th>Introduced</th>
              <th>Notes</th>
            </tr>
          </thead>
          {filteredAvailabilities.map((availability: MechAvailability) => (
  <tr key={availability.id}>
    <td>{getMechName(availability.mechId)}</td>
    <td>{getFactionName(availability.factionId)}</td>
    <td>{getPeriodName(availability.periodId)}</td>
    <td>{renderAvailabilityBadge(availability.availabilityLevel)}</td>
    <td>{availability.introducedYear || 'Unknown'}</td>
    <td>{availability.notes || '-'}</td>
  </tr>
))}
        </Table>
      )}
      
      {/* No results message */}
      {!isLoading && !isError && filteredAvailabilities.length === 0 && (
        <Alert variant="info" className="my-3">
          No availability records found matching the current filters. Try adjusting your search criteria.
        </Alert>
      )}
    </Container>
  );
};

export default MechAvailabilityPage;