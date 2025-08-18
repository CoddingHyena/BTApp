import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner, Badge, Table, Form } from 'react-bootstrap';
import { useGetCampaignsQuery, useDeleteCampaignMutation } from '../store/api/apiSlice';
import { Campaign } from '../types/campaign';

type SortField = 'name' | 'campaignType' | 'status' | 'startDate' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const CampaignManagementPage: React.FC = () => {
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data: campaigns, isLoading, isError, error, refetch } = useGetCampaignsQuery();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  // Получаем уникальные значения для фильтров
  const uniqueStatuses = useMemo(() => {
    if (!campaigns) return [];
    return Array.from(new Set(campaigns.map(campaign => campaign.status))).sort();
  }, [campaigns]);

  const uniqueTypes = useMemo(() => {
    if (!campaigns) return [];
    return Array.from(new Set(campaigns.map(campaign => campaign.campaignType))).sort();
  }, [campaigns]);

  // Функция сортировки
  const sortCampaigns = (campaigns: Campaign[], field: SortField, direction: SortDirection) => {
    return [...campaigns].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Для строковых полей
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Для дат
      if (field === 'startDate' || field === 'createdAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
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

  // Фильтрация и сортировка кампаний
  const filteredAndSortedCampaigns = useMemo(() => {
    if (!campaigns) return [];

    let filtered = campaigns;

    // Фильтр по поисковому запросу
    if (searchFilter.trim()) {
      const filter = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(filter) ||
        (campaign.description && campaign.description.toLowerCase().includes(filter)) ||
        (campaign.game && campaign.game.name.toLowerCase().includes(filter))
      );
    }

    // Фильтр по статусу
    if (statusFilter) {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Фильтр по типу
    if (typeFilter) {
      filtered = filtered.filter(campaign => campaign.campaignType === typeFilter);
    }

    // Сортировка
    return sortCampaigns(filtered, sortField, sortDirection);
  }, [campaigns, searchFilter, statusFilter, typeFilter, sortField, sortDirection]);

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
    setStatusFilter('');
    setTypeFilter('');
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = searchFilter || statusFilter || typeFilter;
  
  const handleDelete = async () => {
    if (!deletingCampaign) return;
    
    try {
      await deleteCampaign(deletingCampaign.id).unwrap();
      setDeletingCampaign(null);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  // Функция для получения цвета бейджа статуса
  const getStatusBadgeColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Функция для получения цвета бейджа типа
  const getTypeBadgeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'main':
        return 'primary';
      case 'sub':
        return 'info';
      case 'event':
        return 'warning';
      default:
        return 'secondary';
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
          Error loading campaigns: {error?.toString()}
        </Alert>
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return (
        <Alert variant="info">
          No campaigns found.
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
                    Поиск кампаний
                  </Form.Label>
                  <Form.Control
                    id="searchFilter"
                    type="text"
                    placeholder="Название, описание, игра..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Поиск по названию, описанию и игре
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label htmlFor="statusFilter">
                    <i className="bi bi-flag me-2"></i>
                    Статус
                  </Form.Label>
                  <Form.Select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Все статусы</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label htmlFor="typeFilter">
                    <i className="bi bi-collection me-2"></i>
                    Тип
                  </Form.Label>
                  <Form.Select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">Все типы</option>
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
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
                    Показано: <strong>{filteredAndSortedCampaigns.length}</strong> из <strong>{campaigns.length}</strong> кампаний
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
        {filteredAndSortedCampaigns.length === 0 ? (
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
              'Нет кампаний для отображения.'
            )}
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <SortableHeader field="name">Название</SortableHeader>
                <th>Игра</th>
                <SortableHeader field="campaignType">Тип</SortableHeader>
                <SortableHeader field="status">Статус</SortableHeader>
                <SortableHeader field="startDate">Дата начала</SortableHeader>
                <SortableHeader field="createdAt">Создана</SortableHeader>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <strong>{campaign.name}</strong>
                    {campaign.description && (
                      <>
                        <br />
                        <small className="text-muted">{campaign.description}</small>
                      </>
                    )}
                  </td>
                  <td>
                    {campaign.game ? (
                      <Badge bg="info">{campaign.game.name}</Badge>
                    ) : (
                      <span className="text-muted">Не указана</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={getTypeBadgeColor(campaign.campaignType)}>
                      {campaign.campaignType}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td>
                    {campaign.startDate ? (
                      new Date(campaign.startDate).toLocaleDateString('ru-RU')
                    ) : (
                      <span className="text-muted">Не указана</span>
                    )}
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(campaign.createdAt).toLocaleDateString('ru-RU')}
                    </small>
                  </td>
                  <td>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => window.open(`/campaigns/${campaign.id}`, '_blank')}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-eye me-2"></i>
                        Просмотр
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => setDeletingCampaign(campaign)}
                        disabled={isDeleting}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-trash me-2"></i>
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
          <h1>Управление кампаниями</h1>
          <p className="lead mb-0">Просмотр и управление кампаниями в системе.</p>
        </div>
        <Button variant="outline-secondary" onClick={refetch} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Обновить'}
        </Button>
      </div>

      {renderContent()}

      {/* Delete Confirmation Modal */}
      <Modal show={!!deletingCampaign} onHide={() => setDeletingCampaign(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Удаление кампании</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingCampaign && (
            <div>
              <p>
                Вы уверены, что хотите удалить кампанию <strong>{deletingCampaign.name}</strong>?
              </p>
              <p className="text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Это действие нельзя отменить. Все данные кампании будут безвозвратно удалены.
              </p>
              {deletingCampaign.description && (
                <p><strong>Описание:</strong> {deletingCampaign.description}</p>
              )}
              <p><strong>Тип:</strong> {deletingCampaign.campaignType}</p>
              <p><strong>Статус:</strong> {deletingCampaign.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingCampaign(null)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Удаление...
              </>
            ) : (
              'Удалить кампанию'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CampaignManagementPage;
