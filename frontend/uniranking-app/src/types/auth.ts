export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type AuthResponse = {
    username: string;
    email: string;
    token: string;
    refreshToken: string;
}

export type LogoutRequest = {
    accessToken: string;
    refreshToken: string;
}

export type LogoutResponse = {
    message: string;
}