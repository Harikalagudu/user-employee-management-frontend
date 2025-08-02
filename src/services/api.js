// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- AUTH SERVICE ---
export const login = (username, password, role) => {
    return api.post('/auth/login', { username, password, role });
};

export const resetPassword = (newPassword) => {
    return api.post('/auth/reset-password', { newPassword });
};

// --- ADMIN SERVICE ---
export const getAdminDashboardStats = () => {
    return api.get('/admin/dashboard/stats');
};

export const getManageableUsers = (params) => {
    return api.get('/admin/users', { params });
};

export const updateUserStatus = (userId, isEnabled) => {
    return api.put(`/admin/users/${userId}/status`, { enabled: isEnabled });
};

export const createUser = (userData) => {
    return api.post('/admin/users', userData);
};

// ✅ Export Users (returns blob)
export const exportUsersAsCSV = () => {
    return api.get('/admin/users/export', { responseType: 'blob' });
};

// --- HR / MANAGER SERVICE ---
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getEmployees = (params) => api.get('/dashboard/employees', { params });
export const onboardEmployee = (data) => api.post('/dashboard/employees', data);
export const updateEmployee = (id, data) => api.put(`/dashboard/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/dashboard/employees/${id}`);

// --- LEAVE MANAGEMENT SERVICE ---
export const getMyLeaveBalances = () => api.get('/leave/my-balances');
export const getMyLeaveRequests = () => api.get('/leave/my-requests');
export const submitLeaveRequest = (data) => api.post('/leave/requests', data);
export const getPendingLeaveRequests = () => api.get('/leave/requests/pending');
export const updateLeaveRequestStatus = (id, status) => api.put(`/leave/requests/${id}/status`, { status });

export default api;
