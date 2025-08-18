import React from 'react';

interface BattleTechIconProps {
  size?: number;
  color?: string;
}

const BattleTechIcon: React.FC<BattleTechIconProps> = ({ 
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
      {/* Внешний круг */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Внутренний шестиугольник */}
      <polygon
        points="24,4 36,12 36,24 24,32 12,24 12,12"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Центральная точка */}
      <circle
        cx="24"
        cy="24"
        r="3"
        fill={color}
      />
      
      {/* Текст BT */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill={color}
      >
        BT
      </text>
    </svg>
  );
};

export default BattleTechIcon; 