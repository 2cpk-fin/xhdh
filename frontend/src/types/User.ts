export interface UserRequest {
    username: string;
    email: string;
    password?: string; // Optional if used for updates where password isn't always required
    profileImageUrl?: string;
}

export interface UserResponse {
    username: string;
    email: string;
    profileImageUrl: string | null;
}