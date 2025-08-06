
// src/pages/HomePage.tsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavButton_Type1 from '../components/NavButton_Type1';

const HomePage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <h1 className="text-center mb-5">Добро пожаловать в BTapp</h1>
              
              <div className="d-grid gap-3">
                <NavButton_Type1 to="/bt" variant="primary">
                  BattleTech
                </NavButton_Type1>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;