import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    sub: string; // email
    username: string // username
}

export const getCurrentUsernameFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.username;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};