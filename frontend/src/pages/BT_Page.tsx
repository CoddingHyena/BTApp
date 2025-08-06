import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavButton_Type1 from '../components/NavButton_Type1';

const BT_Page: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <h1 className="text-center mb-5">BattleTech</h1>
              
              <div className="d-grid gap-3">
                <NavButton_Type1 to="/mechs" variant="outline-primary">
                  Список мехов
                </NavButton_Type1>
                
                <NavButton_Type1 to="/raw-mechs/validate" variant="outline-warning">
                  Валидация мехов
                </NavButton_Type1>
                
                <NavButton_Type1 to="/availability" variant="outline-success">
                  Доступность
                </NavButton_Type1>
                
                <NavButton_Type1 to="/import" variant="outline-info">
                  Импорт данных
                </NavButton_Type1>
                
                <NavButton_Type1 to="/factions" variant="outline-secondary">
                  Фракции
                </NavButton_Type1>
                
                <NavButton_Type1 to="/missions" variant="outline-dark">
                  Миссии
                </NavButton_Type1>
                
                <NavButton_Type1 to="/periods" variant="outline-primary">
                  Периоды
                </NavButton_Type1>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BT_Page; 