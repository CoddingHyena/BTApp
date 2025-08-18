import React from 'react';

interface MechIconProps {
  size?: number;
  color?: string;
}

const MechIcon: React.FC<MechIconProps> = ({ 
  size = 48, 
  color = 'currentColor' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Основной корпус меха */}
      <rect
        x="12"
        y="20"
        width="24"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Голова меха */}
      <circle
        cx="24"
        cy="16"
        r="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Руки */}
      <rect
        x="8"
        y="22"
        width="6"
        height="12"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="34"
        y="22"
        width="6"
        height="12"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Ноги */}
      <rect
        x="16"
        y="36"
        width="4"
        height="8"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="28"
        y="36"
        width="4"
        height="8"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Оружие */}
      <line
        x1="6"
        y1="28"
        x2="2"
        y2="28"
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1="46"
        y1="28"
        x2="42"
        y2="28"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export default MechIcon; 