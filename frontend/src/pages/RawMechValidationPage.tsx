import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner, Badge, Table, Form } from 'react-bootstrap';
import { useGetRawMechsPendingQuery, useValidateRawMechMutation, useDeleteRawMechMutation } from '../store/api/apiSlice';
import { RawMech } from '../types/mech';

type SortField = 'name' | 'chassis' | 'technology' | 'tonnage' | 'battleValue' | 'year';
type SortDirection = 'asc' | 'desc';

// Определяем весовые классы
const WEIGHT_CLASSES = {
  'light': { name: 'Лёгкий', min: 0, max: 35 },
  'medium': { name: 'Средний', min: 40, max: 55 },
  'heavy': { name: 'Тяжёлый', min: 60, max: 75 },
  'assault': { name: 'Штурмовой', min: 80, max: 100 },
  'superheavy': { name: 'Сверхтяжёлый', min: 101, max: Infinity }
} as const;

type WeightClass = keyof typeof WEIGHT_CLASSES;

// Функция для нормализации технологии (объединение Mixed Tech)
const normalizeTechnology = (technology: string): string => {
  if (technology.toLowerCase().includes('mixed')) {
    return 'Mixed Tech';
  }
  return technology;
};

// Функция для получения цвета бейджа технологии
const getTechnologyBadgeColor = (technology: string): string => {
  const normalized = normalizeTechnology(technology);
  switch (normalized) {
    case 'Clan':
      return 'danger';
    case 'Mixed Tech':
      return 'warning';
    case 'Inner Sphere':
      return 'primary';
    default:
      return 'secondary';
  }
};

const RawMechValidationPage: React.FC = () => {
  const [validatingMech, setValidatingMech] = useState<RawMech | null>(null);
  const [deletingMech, setDeletingMech] = useState<RawMech | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [technologyFilter, setTechnologyFilter] = useState<string>('');
  const [weightClassFilter, setWeightClassFilter] = useState<WeightClass | ''>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data: pendingMechs, isLoading, isError, error, refetch } = useGetRawMechsPendingQuery();
  const [validateRawMech, { isLoading: isValidating }] = useValidateRawMechMutation();
  const [deleteRawMech, { isLoading: isDeleting }] = useDeleteRawMechMutation();

  // Получаем уникальные значения для фильтров (с нормализацией технологий)
  const uniqueTechnologies = useMemo(() => {
    if (!pendingMechs) return [];
    
    const technologies = pendingMechs.map(mech => normalizeTechnology(mech.technology));
    return Array.from(new Set(technologies)).sort();
  }, [pendingMechs]);

  // Функция для определения весового класса меха
  const getWeightClass = (tonnage: number): WeightClass => {
    if (tonnage <= 35) return 'light';
    if (tonnage <= 55) return 'medium';
    if (tonnage <= 75) return 'heavy';
    if (tonnage <= 100) return 'assault';
    return 'superheavy';
  };

  // Функция сортировки
  const sortMechs = (mechs: RawMech[], field: SortField, direction: SortDirection) => {
    return [...mechs].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Для строковых полей
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Для числовых полей
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (direction === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      // Для строковых полей
      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // Фильтрация и сортировка мехов
  const filteredAndSortedMechs = useMemo(() => {
    if (!pendingMechs) return [];

    let filtered = pendingMechs;

    // Фильтр по поисковому запросу
    if (searchFilter.trim()) {
      const filter = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(mech => 
        mech.name.toLowerCase().includes(filter) ||
        mech.chassis.toLowerCase().includes(filter) ||
        mech.technology.toLowerCase().includes(filter) ||
        mech.unitType.toLowerCase().includes(filter)
      );
    }

    // Фильтр по технологии (с нормализацией)
    if (technologyFilter) {
      filtered = filtered.filter(mech => normalizeTechnology(mech.technology) === technologyFilter);
    }

    // Фильтр по весовому классу
    if (weightClassFilter) {
      const weightClass = WEIGHT_CLASSES[weightClassFilter];
      filtered = filtered.filter(mech => 
        mech.tonnage >= weightClass.min && mech.tonnage <= weightClass.max
      );
    }

    // Сортировка
    return sortMechs(filtered, sortField, sortDirection);
  }, [pendingMechs, searchFilter, technologyFilter, weightClassFilter, sortField, sortDirection]);

  // Обработчик изменения сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Компонент заголовка таблицы с сортировкой
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      style={{ cursor: 'pointer' }}
      onClick={() => handleSort(field)}
      className="user-select-none"
    >
      <div className="d-flex align-items-center">
        {children}
        {sortField === field && (
          <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
        )}
      </div>
    </th>
  );

  // Сброс всех фильтров
  const clearAllFilters = () => {
    setSearchFilter('');
    setTechnologyFilter('');
    setWeightClassFilter('');
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = searchFilter || technologyFilter || weightClassFilter;
  
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
      <>
        {/* Панель фильтров */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label htmlFor="searchFilter">
                    <i className="bi bi-search me-2"></i>
                    Поиск мехов
                  </Form.Label>
                  <Form.Control
                    id="searchFilter"
                    type="text"
                    placeholder="Название, шасси, тип юнита..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Поиск по названию, шасси и типу юнита
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label htmlFor="technologyFilter">
                    <i className="bi bi-gear me-2"></i>
                    Технология
                  </Form.Label>
                  <Form.Select
                    id="technologyFilter"
                    value={technologyFilter}
                    onChange={(e) => setTechnologyFilter(e.target.value)}
                  >
                    <option value="">Все технологии</option>
                    {uniqueTechnologies.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Clan Mixed и Inner Sphere Mixed объединены в Mixed Tech
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label htmlFor="weightClassFilter">
                    <i className="bi bi-weight me-2"></i>
                    Весовой класс
                  </Form.Label>
                  <Form.Select
                    id="weightClassFilter"
                    value={weightClassFilter}
                    onChange={(e) => setWeightClassFilter(e.target.value as WeightClass | '')}
                  >
                    <option value="">Все классы</option>
                    {Object.entries(WEIGHT_CLASSES).map(([key, weightClass]) => (
                      <option key={key} value={key}>
                        {weightClass.name} ({weightClass.min}-{weightClass.max === Infinity ? '∞' : weightClass.max} т)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <div className="w-100">
                  {hasActiveFilters && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="w-100"
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Очистить
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
            
            {/* Статистика фильтрации */}
            <Row className="mt-3">
              <Col>
                <div className="text-muted">
                  <small>
                    Показано: <strong>{filteredAndSortedMechs.length}</strong> из <strong>{pendingMechs.length}</strong> мехов
                    {hasActiveFilters && (
                      <span className="ms-2">
                        (применены фильтры)
                      </span>
                    )}
                    <span className="ms-2">
                      | Сортировка: <strong>{sortField}</strong> ({sortDirection === 'asc' ? 'по возрастанию' : 'по убыванию'})
                    </span>
                  </small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Таблица с отфильтрованными и отсортированными данными */}
        {filteredAndSortedMechs.length === 0 ? (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {hasActiveFilters ? (
              <>
                По вашим фильтрам ничего не найдено.
                <Button 
                  variant="link" 
                  className="p-0 ms-2" 
                  onClick={clearAllFilters}
                >
                  Очистить все фильтры
                </Button>
              </>
            ) : (
              'Нет мехов для валидации.'
            )}
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>DB ID</th>
                <SortableHeader field="name">Name</SortableHeader>
                <SortableHeader field="chassis">Chassis</SortableHeader>
                <SortableHeader field="technology">Technology</SortableHeader>
                <SortableHeader field="tonnage">Tonnage</SortableHeader>
                <SortableHeader field="battleValue">Battle Value</SortableHeader>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedMechs.map((mech) => {
                const weightClass = getWeightClass(mech.tonnage);
                const weightClassInfo = WEIGHT_CLASSES[weightClass];
                const normalizedTechnology = normalizeTechnology(mech.technology);
                
                return (
                  <tr key={mech.id}>
                    <td>{mech.dbId}</td>
                    <td>
                      <strong>{mech.name}</strong>
                      <br />
                      <small className="text-muted">{mech.unitType}</small>
                    </td>
                    <td>{mech.chassis}</td>
                    <td>
                      <Badge bg={getTechnologyBadgeColor(mech.technology)}>
                        {normalizedTechnology}
                      </Badge>
                      {mech.technology !== normalizedTechnology && (
                        <>
                          <br />
                          <small className="text-muted">({mech.technology})</small>
                        </>
                      )}
                    </td>
                    <td>
                      {mech.tonnage} т
                      <br />
                      <Badge 
                        bg={
                          weightClass === 'light' ? 'success' :
                          weightClass === 'medium' ? 'info' :
                          weightClass === 'heavy' ? 'warning' :
                          weightClass === 'assault' ? 'danger' :
                          'dark'
                        }
                        className="mt-1"
                      >
                        {weightClassInfo.name}
                      </Badge>
                    </td>
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
                );
              })}
            </tbody>
          </Table>
        )}
      </>
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