import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  children, 
  size = 48, 
  className = '',
  style = {}
}) => {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default IconWrapper; 