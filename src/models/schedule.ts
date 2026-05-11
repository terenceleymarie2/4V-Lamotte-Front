export interface Schedule {
    date: string;
    games: Game[];
}

export interface Game {
    category: string;
    hour: string;
    field: string;
    teamA: string;
    teamB: string;
    score: string;
}