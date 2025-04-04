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
    createdAt?: string;
    updatedAt?: string;
  }

  export interface RawMech {
    id: string;
    dbId: string; 
    name: string;
    unitType: string;
    technology: string;
    chassis: string;
    era: string;
    year: number;
    rulesLevel: number;
    tonnage: number;
    battleValue: number;
    pointValue: number;
    cost: number;
    rating: string;
    designer?: string;
    validated?: boolean;
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