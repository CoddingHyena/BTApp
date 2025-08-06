import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Faction } from '../types/faction';
import { getImageUrl } from '../config/api';

interface FactionCardProps {
  faction: Faction;
  showActions?: boolean;
  onEdit?: (faction: Faction) => void;
  onDelete?: (faction: Faction) => void;
  className?: string;
}

const FactionCard: React.FC<FactionCardProps> = ({
  faction,
  showActions = false,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <Card className={`h-100 faction-card ${className}`}>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          {faction.logoUrl && (
            <img 
              src={getImageUrl(faction.logoUrl)} 
              alt={`${faction.name} logo`}
              className="me-3"
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => {
                console.error('Failed to load logo:', faction.logoUrl);
                console.error('Full logo URL:', getImageUrl(faction.logoUrl || ''));
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Logo loaded successfully:', faction.logoUrl);
              }}
            />
          )}
          <Card.Title>{faction.name}</Card.Title>
        </div>
        <Card.Subtitle className="mb-2 text-muted">{faction.code}</Card.Subtitle>
        <Card.Text>{faction.description}</Card.Text>
        <div className="faction-colors d-flex mb-2">
          <div 
            className="color-box me-2" 
            style={{
              backgroundColor: faction.primaryColor,
              width: '20px',
              height: '20px',
              border: '1px solid #ddd'
            }}
          />
          <div 
            className="color-box" 
            style={{
              backgroundColor: faction.secondaryColor,
              width: '20px',
              height: '20px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        {showActions && (
          <div className="mb-2">
            <span className={`badge ${faction.isMajor ? 'bg-primary' : 'bg-secondary'} me-2`}>
              {faction.isMajor ? 'Major' : 'Minor'}
            </span>
            <span className={`badge ${faction.isActive ? 'bg-success' : 'bg-danger'}`}>
              {faction.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted">
        Formed: {faction.formationYear}
        {faction.dissolutionYear && ` - Dissolved: ${faction.dissolutionYear}`}
      </Card.Footer>
      {showActions && onEdit && onDelete && (
        <Card.Footer>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => onEdit(faction)}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(faction)}
            >
              Delete
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default FactionCard; 