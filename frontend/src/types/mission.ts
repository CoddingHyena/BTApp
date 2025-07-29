export enum MissionType {
  CLASSIC = 'CLASSIC',
  ALPHA_STRIKE = 'ALPHA_STRIKE'
}

export enum MissionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  description?: string;
  objectives: string[];
  type: MissionType;
  difficulty: MissionDifficulty;
  cost?: number;
  reward?: Record<string, any>;
  deploymentUrl?: string;
  source?: string;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMissionDto {
  code: string;
  title: string;
  description?: string;
  objectives: string[];
  type: MissionType;
  difficulty: MissionDifficulty;
  cost?: number;
  reward?: Record<string, any>;
  deploymentUrl?: string;
  source?: string;
  isOfficial?: boolean;
}

export interface UpdateMissionDto extends Partial<CreateMissionDto> {} 