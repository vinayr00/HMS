import { apiClient } from './api.js';

export const publicService = {
    /**
     * Book an appointment without authentication.
     * POST /api/v1/public/appointments
     */
    bookAppointment: (data) =>
        apiClient.post('/public/appointments', data),

    /**
     * Fetch the public doctor directory for booking forms.
     * GET /api/v1/users/public/doctors
     */
    getDoctors: async () => {
        try {
            const data = await apiClient.get('/users/public/doctors');
            return data.doctors || data.data || [];
        } catch (err) {
            console.error('Failed to load public doctors:', err.message);
            return [];
        }
    },
};
