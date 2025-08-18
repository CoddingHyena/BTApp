import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavButton_Type1Props {
  to: string;
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'lg';
  className?: string;
  icon?: React.ReactNode; // Добавляем поддержку иконки
  iconSize?: number; // Размер иконки в пикселях
}

const NavButton_Type1: React.FC<NavButton_Type1Props> = ({
  to,
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  icon,
  iconSize = 48 // Размер иконки по умолчанию
}) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Button
        variant={variant}
        size={size}
        className={`mb-3 ${className}`}
        style={{ 
          width: '200px',
          height: '200px',
          fontSize: '1.1rem',
          fontWeight: '500',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px' // Отступ между иконкой и текстом
        }}
      >
        {icon && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: `${iconSize}px`,
            height: `${iconSize}px`
          }}>
            {icon}
          </div>
        )}
        <div>
          {children}
        </div>
      </Button>
    </Link>
  );
};

export default NavButton_Type1; 