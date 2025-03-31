export enum AvailabilityLevel {
    COMMON = 'COMMON',
    UNCOMMON = 'UNCOMMON',
    RARE = 'RARE',
    VERY_RARE = 'VERY_RARE',
    EXPERIMENTAL = 'EXPERIMENTAL',
    PROTOTYPE = 'PROTOTYPE',
  }
  
  export interface MechAvailability {
    id: string;
    mechId: string;
    factionId: string;
    periodId: string;
    availabilityLevel: AvailabilityLevel;
    introducedYear?: number;
    notes?: string;
  }