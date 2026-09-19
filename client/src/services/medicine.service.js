import { apiClient } from './api.js';

export const medicineService = {
    getAll: () => apiClient.get('/medicines').then(d => d.medicines),
    create: (data) => apiClient.post('/medicines', data).then(d => d.medicine),
    update: (id, data) => apiClient.patch(`/medicines/${id}`, data).then(d => d.medicine),
    remove: (id) => apiClient.delete(`/medicines/${id}`),
};
