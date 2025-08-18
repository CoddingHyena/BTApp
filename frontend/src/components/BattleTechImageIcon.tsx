import React from 'react';
import { getImageUrl } from '../config/api';

interface BattleTechImageIconProps {
  size?: number;
  className?: string;
}

const BattleTechImageIcon: React.FC<BattleTechImageIconProps> = ({ 
  size = 48, 
  className = ''
}) => {
  const imagePath = 'uploads/games/icons/BT_Logo.png';
  
  return (
    <img
      src={getImageUrl(imagePath)}
      alt="BattleTech Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain'
      }}
      className={className}
    />
  );
};

export default BattleTechImageIcon; 