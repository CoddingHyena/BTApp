import React from 'react';
import { getImageUrl } from '../config/api';

interface TrenchCrusadeImageIconProps {
  size?: number;
  className?: string;
}

const TrenchCrusadeImageIcon: React.FC<TrenchCrusadeImageIconProps> = ({ 
  size = 48, 
  className = ''
}) => {
  const imagePath = 'uploads/games/icons/Trench_Pilgrims_Logo.png';
  
  return (
    <img
      src={getImageUrl(imagePath)}
      alt="Trench Crusade Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain'
      }}
      className={className}
    />
  );
};

export default TrenchCrusadeImageIcon; 