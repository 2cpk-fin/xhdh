import type { TagResponse } from "./tag";

export type UniversityRequest = {
    name: string;
    abbreviation: string;
    elo: number;
    tagIds: number[]
}

export type UniversityResponse = {
    id: number,
    publicUniversityId: string,
    name: string;
    abbreviation: string;
    tags: TagResponse[];
    elo: number;
}