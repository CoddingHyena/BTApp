
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
    gameIdRef?: string;
    game?: Game;
    isMajor: boolean;
    isActive: boolean;
}

export interface CreateFactionDto {
    name: string;
    code: string;
    primaryColor?: string;
    secondaryColor?: string;
    formationYear?: number;
    dissolutionYear?: number;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    gameIdRef?: string;
    isMajor?: boolean;
    isActive?: boolean;
}

export interface UpdateFactionDto extends Partial<CreateFactionDto> {}

export interface Game {
    id: string;
    name: string;
    description?: string;
    category: string;
    iconUrl?: string;
    bannerUrl?: string;
    isActive: boolean;
    sortOrder: number;
}