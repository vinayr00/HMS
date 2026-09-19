import { apiClient } from './api.js';

export const authService = {
    login: async (role, id, password) => {
        // Call the real backend — no more hardcoded credentials
        const data = await apiClient.post('/auth/login', {
            employeeId: id,
            password,
            role,
        });
        return data; // { token, user: { id, name, role, employeeId, department, email } }
    },

    me: async () => {
        const data = await apiClient.get('/auth/me');
        return data.user;
    },

    logout: async () => {
        // No server-side session to invalidate for JWT
        // Token removal handled in AuthContext
        return true;
    },
};
