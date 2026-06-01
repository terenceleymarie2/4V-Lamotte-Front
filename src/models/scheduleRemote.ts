export interface CreateScheduleRequest {
    date: string;
    competition: string;
    category: string;
    hour: string;
    field: string;
    teamA: string;
    teamB: string;
    score?:string;
}

export interface PatchScheduleRequest {
    date?: string;
    competition: string;
    category?: string;
    hour?: string;
    field?: string;
    teamA?: string;
    teamB?: string;
}