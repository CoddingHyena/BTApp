import React from 'react';
import { useAppSelector } from '@/hooks/redux';
import type { Faction } from '@/types';

interface FactionSelectorProps {
  selectedFactionId: number;
  onFactionChange: (factionId: number) => void;
  className?: string;
}

const FactionSelector: React.FC<FactionSelectorProps> = ({
  selectedFactionId,
  onFactionChange,
  className = ''
}) => {
  const { factions } = useAppSelector((state) => state.factions);

  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label">
        Фракция для генерации пилота:
      </label>
      <select
        className="form-select"
        value={selectedFactionId}
        onChange={(e) => onFactionChange(Number(e.target.value))}
      >
        {factions.map((faction: Faction) => (
          <option key={faction.id} value={faction.id}>
            {faction.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FactionSelector;
