import { apiClient } from './api.js';

export const appointmentService = {
    getAll: () => apiClient.get('/appointments').then(d => d.appointments),
    create: (data) => apiClient.post('/appointments', data).then(d => d.appointment),
    updateStatus: (id, status, notes) =>
        apiClient.patch(`/appointments/${id}/status`, { status, notes }).then(d => d.appointment),
};
