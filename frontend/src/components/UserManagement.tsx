import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUsers, updateUserRole, updateUserStatus, clearError } from '../store/slices/userSlice';
import { User } from '../types/user';
import { Table, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error } = useSelector((state: RootState) => state.users);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleRoleChange = async (userId: string, newRole: 'PLAYER' | 'MODERATOR' | 'ADMIN') => {
    await dispatch(updateUserRole({ userId, role: newRole }));
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    await dispatch(updateUserStatus({ userId, isActive }));
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'MODERATOR': return 'Модератор';
      case 'PLAYER': return 'Игрок';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MODERATOR': return 'warning';
      case 'PLAYER': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'success' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
        <p className="mt-3">Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Управление пользователями</h2>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-medium me-2" 
                           style={{width: '32px', height: '32px'}}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-medium">{user.username}</div>
                        {user.firstName && user.lastName && (
                          <small className="text-muted">
                            {user.firstName} {user.lastName}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(user.isActive)}>
                      {user.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* Изменение роли */}
                      <Form.Select
                        size="sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'PLAYER' | 'MODERATOR' | 'ADMIN')}
                        disabled={user.id === currentUser?.id}
                        style={{ width: 'auto' }}
                      >
                        <option value="PLAYER">Игрок</option>
                        <option value="MODERATOR">Модератор</option>
                        <option value="ADMIN">Администратор</option>
                      </Form.Select>

                      {/* Изменение статуса */}
                      <Button
                        size="sm"
                        variant={user.isActive ? 'outline-danger' : 'outline-success'}
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.isActive ? 'Деактивировать' : 'Активировать'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {users.length === 0 && !isLoading && (
            <div className="text-center p-5">
              <p className="text-muted">Пользователи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 