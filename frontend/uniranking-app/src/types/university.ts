import type { TagResponse } from "./tag";

export type UniversityResponse = {
    id: number,
    publicUniversityId: string,
    name: string;
    abbreviation: string;
    tags: TagResponse[];
    elo: number;
}