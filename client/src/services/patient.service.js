import { apiClient } from './api.js';

export const patientService = {
    getAll: () => apiClient.get('/patients').then(d => d.patients),
    getOne: (id) => apiClient.get(`/patients/${id}`).then(d => d.patient),
    create: (data) => apiClient.post('/patients', data).then(d => d.patient),
};
