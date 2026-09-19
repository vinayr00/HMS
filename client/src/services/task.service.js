import { apiClient } from './api.js';

export const taskService = {
    getMine: () => apiClient.get('/tasks').then(d => d.tasks),
    updateStatus: (id, status) =>
        apiClient.patch(`/tasks/${id}/status`, { status }).then(d => d.task),
};
