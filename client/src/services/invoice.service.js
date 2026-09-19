import { apiClient } from './api.js';

export const invoiceService = {
    getAll: () => apiClient.get('/invoices').then(d => d.invoices),
    create: (data) => apiClient.post('/invoices', data).then(d => d.invoice),
    markPaid: (id) => apiClient.patch(`/invoices/${id}/pay`).then(d => d.invoice),
    refund: (id) => apiClient.patch(`/invoices/${id}/refund`).then(d => d.invoice),
};
