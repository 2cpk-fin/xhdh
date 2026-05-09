import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    sub: string; // email
    username: string; // username
    role: string;
}

export const getCurrentUsernameFromToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.username;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};

export const getUserRoleFromToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.role;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};

export const isAdmin = (): boolean => {
    const role = getUserRoleFromToken();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
};