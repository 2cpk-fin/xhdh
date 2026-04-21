export interface TagResponse {
    id: string; // UUID mapped to string
    name: string;
    universities: string[]; // List of university names
}

export interface UniversityResponse {
    id: string; // UUID mapped to string
    name: string;
    abbreviation: string;
    tags: string[]; // List of tag names
    elo: number;
}