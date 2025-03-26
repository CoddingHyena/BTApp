
// src/pages/HomePage.tsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import LinkButton from '../components/LinkButton';

const HomePage: React.FC = () => {
  return (
    <Container fluid className="py-5">
      <div className="mx-auto" style={{ maxWidth: '1400px' }}>
        <h1 className="mb-4">Добро пожаловать в BTapp</h1>
        <p className="mb-4">
          Это приложение поможет вам управлять данными мехов для игры Classic Battletech.
        </p>
        <Card>
          <Card.Body>
            <Card.Title>Возможности приложения:</Card.Title>
            <ul className="ps-4 mb-4">
              <li>Импорт данных мехов из CSV-файлов</li>
              <li>Еще функционал</li>
              <li>И еще функционал</li>
              <li>И тут будет функционал</li>
            </ul>
            <LinkButton 
              to="/import" 
              variant="primary"
            >
              Начать импорт данных
            </LinkButton>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default HomePage;