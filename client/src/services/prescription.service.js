import { apiClient } from './api.js';

export const prescriptionService = {
    getAll: () => apiClient.get('/prescriptions').then(d => d.prescriptions),
    create: (data) => apiClient.post('/prescriptions', data).then(d => d.prescription),
    dispense: (id) => apiClient.patch(`/prescriptions/${id}/dispense`).then(d => d.prescription),
    reject: (id, reason) =>
        apiClient.patch(`/prescriptions/${id}/reject`, { reason }).then(d => d.prescription),
};
