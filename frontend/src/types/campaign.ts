export interface Campaign {
  id: string;
  name: string;
  description?: string;
  gameId: string;
  game?: {
    id: string;
    name: string;
    category: string;
  };
  campaignType: string;
  parentCampaignId?: string;
  parentCampaign?: Campaign;
  status: string;
  startDate?: string;
  endDate?: string;
  accessType: string;
  maxPlayers?: number;
  minPlayers?: number;
  commonRules?: Record<string, any>;
  gameSpecificRules?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
  imageUrl?: string;
  geographicScope?: string;
  thematicFocus?: string;
  eventType?: string;
  durationHours?: number;
  maxParticipants?: number;
  autoGenerate?: boolean;
  triggerConditions?: Record<string, any>;
  completionConditions?: Record<string, any>;
  rewards?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  gameId: string;
  campaignType: string;
  parentCampaignId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  accessType?: string;
  maxPlayers?: number;
  minPlayers?: number;
  commonRules?: Record<string, any>;
  gameSpecificRules?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
  imageUrl?: string;
  geographicScope?: string;
  thematicFocus?: string;
  eventType?: string;
  durationHours?: number;
  maxParticipants?: number;
  autoGenerate?: boolean;
  triggerConditions?: Record<string, any>;
  completionConditions?: Record<string, any>;
  rewards?: Record<string, any>;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {}
