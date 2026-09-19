const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getToken = () => localStorage.getItem('hms_token');

const request = async (method, endpoint, body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    let res;
    try {
        res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (networkErr) {
        const err = new Error('Network error or server unreachable. Please check connection or server status.');
        err.status = 0;
        err.isNetworkError = true;
        throw err;
    }

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await res.json().catch(() => ({}));
    } else {
        const text = await res.text().catch(() => '');
        data = { error: text || `HTTP ${res.status} ${res.statusText}` };
    }

    if (!res.ok) {
        const err = new Error(data.error || `Request failed: ${res.status}`);
        err.status = res.status;
        err.data = data;
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
