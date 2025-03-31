
export interface Faction {
    id: string;
    name: string;
    code: string;
    primaryColor: string;
    secondaryColor: string;
    formationYear: number;
    dissolutionYear?: number;
    description: string;
    logoUrl?: string;
    bannerUrl?: string;
  }