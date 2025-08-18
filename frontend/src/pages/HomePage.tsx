
// src/pages/HomePage.tsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavButton_Type1 from '../components/NavButton_Type1';
import BattleTechImageIcon from '../components/BattleTechImageIcon';
import TrenchCrusadeImageIcon from '../components/TrenchCrusadeImageIcon';

const HomePage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <h1 className="text-center mb-5">Добро пожаловать в BTapp</h1>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <NavButton_Type1 
                    to="/bt" 
                    variant="light"
                    icon={<BattleTechImageIcon size={96} />}
                    iconSize={96}
                  >
                    BattleTech
                  </NavButton_Type1>
                </div>
                
                <div className="col-md-6">
                  <NavButton_Type1 
                    to="/tc" 
                    variant="light"
                    icon={<TrenchCrusadeImageIcon size={96} />}
                    iconSize={96}
                  >
                    Trench Crusade
                  </NavButton_Type1>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;