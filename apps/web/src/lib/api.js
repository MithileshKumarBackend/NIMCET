import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export function getApiErrorMessage(error, fallback = 'Request failed') {
    const response = error?.response?.data;

    if (typeof response?.message === 'string' && response.message.trim()) {
        return response.message;
    }

    if (Array.isArray(response?.errors) && response.errors.length > 0) {
        return response.errors.map((item) => item.message).join(', ');
    }

    return error?.message || fallback;
}
