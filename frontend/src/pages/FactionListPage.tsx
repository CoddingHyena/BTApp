import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { useGetFactionsQuery, useGetGamesQuery } from '../store/api/apiSlice';
import { Faction } from '../types/faction';
import FactionCard from '../components/FactionCard';

const FactionListPage: React.FC = () => {
  const { data: factions, isLoading, isError, error, status } = useGetFactionsQuery();
  const { data: games } = useGetGamesQuery();
  const [storedFactions, setStoredFactions] = useState<Faction[]>([]);
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
          No factions found. Factions will be displayed here once they're available.
        </Alert>
      );
    }
    
    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {storedFactions.map((faction) => (
          <Col key={faction.id}>
            <FactionCard faction={faction} />
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
    </Container>
  );
};

export default FactionListPage;