import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`}>
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;