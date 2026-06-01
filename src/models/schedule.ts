export enum CompetitionEnum {
    _2026_LAMOTTE = "2026_Lamotte",
    _2026_CLUNY = "2026_Cluny",
    _2026_JARDY = "2026_Jardy"
}
export interface Schedule {
    date: string;
    games: Game[];
}

export interface Game {
    id?: number;
    competition: string;
    category: string;
    hour: string;
    field: string;
    teamA: string;
    teamB: string;
    score: string;
}

export interface Category {
    id: string;
    competition: string;
    category: string;
}
