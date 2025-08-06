import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavButton_Type1Props {
  to: string;
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

const NavButton_Type1: React.FC<NavButton_Type1Props> = ({
  to,
  children,
  variant = 'primary',
  size = 'lg',
  className = ''
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
          textAlign: 'center'
        }}
      >
        {children}
      </Button>
    </Link>
  );
};

export default NavButton_Type1; 