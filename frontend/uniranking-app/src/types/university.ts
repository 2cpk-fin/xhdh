export type UniversityRequest = {
    name: string;
    abbreviation: string;
    elo: number;
    tags: string[];
}

export type UniversityResponse = {
    id: number;
    publicUniversityId: string;
    name: string;
    abbreviation: string;
    tags: string[];
    elo: number;
}