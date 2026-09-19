import { apiClient } from './api.js';

export const adminService = {
    // Users
    getUsers: () => apiClient.get('/users').then(d => d.users),
    createUser: (data) => apiClient.post('/users', data).then(d => d.user),
    updateUser: (id, data) => apiClient.patch(`/users/${id}`, data).then(d => d.user),
    toggleStatus: (id) => apiClient.patch(`/users/${id}/toggle-status`).then(d => d.user),
    deleteUser: (id) => apiClient.delete(`/users/${id}`),

    // Audit Logs
    getLogs: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiClient.get(`/audit${qs ? '?' + qs : ''}`).then(d => d);
    },

    // Invoices (admin can see all)
    getInvoices: () => apiClient.get('/invoices').then(d => d.invoices),
    refundInvoice: (id) => apiClient.patch(`/invoices/${id}/refund`).then(d => d.invoice),
};
