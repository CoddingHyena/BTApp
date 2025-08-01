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

export interface CreateGameDto {
    name: string;
    description?: string;
    category: string;
    iconUrl?: string;
    bannerUrl?: string;
    isActive?: boolean;
    sortOrder: number;
}

export interface UpdateGameDto extends Partial<CreateGameDto> {}

export type GameCategory = 'TACTICAL' | 'STRATEGIC' | 'RPG' | 'BOARD_GAME' | 'MINIATURES'; 