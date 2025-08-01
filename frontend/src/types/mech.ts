// src/types/mech.ts
export interface Mech {
    id: string;
    dbId: string;
    name: string;
    unitType: string;
    technology: string;
    chassis: string;
    era: string;
    year: number;
    rulesLevel: string;
    tonnage: number;
    battleValue: number;
    pointValue: number;
    cost: number | null;
    rating: string | null;
    designer: string | null;
    alphaCard?: string;
    recSheet?: string;
    vid?: string;
    rawMechId?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface RawMech {
    id: string;
    dbId: number; 
    name: string;
    unitType: string;
    technology: string;
    chassis: string;
    era: string;
    year: number;
    rulesLevel: string;
    tonnage: number;
    battleValue: number;
    pointValue: number;
    cost: number | null;
    rating: string | null;
    designer: string | null;
    validated: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ImportResult {
    success: boolean;
    totalRecords: number;
    importedRecords: number;
    skippedRecords: number;
    errors: string[];
    elapsedTimeMs: number;
  }

  export interface ValidateRawMechDto {
    validated?: boolean;
  }

  export interface CreateMechDto {
    dbId: number;
    name: string;
    unitType: string;
    technology: string;
    chassis: string;
    era: string;
    year: number;
    rulesLevel: string;
    tonnage: number;
    battleValue: number;
    pointValue: number;
    cost?: number;
    rating?: string;
    designer?: string;
    alphaCard?: string;
    recSheet?: string;
    vid?: string;
    rawMechId?: string;
  }

  export interface UpdateMechDto extends Partial<CreateMechDto> {}