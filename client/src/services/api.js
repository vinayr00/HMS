const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getToken = () => localStorage.getItem('hms_token');

const request = async (method, endpoint, body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.error || `Request failed: ${res.status}`);
        err.status = res.status;
        throw err;
    }

    return data;
};

export const apiClient = {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, body) => request('POST', endpoint, body),
    patch: (endpoint, body) => request('PATCH', endpoint, body),
    delete: (endpoint) => request('DELETE', endpoint),
};
