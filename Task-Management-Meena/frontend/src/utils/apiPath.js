// Base URL of the backend API
export const BASE_URL = 'http://localhost:3001/api';

export const AUTH = {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    PROFILE: `${BASE_URL}/auth/profile`,
    UPDATE_PROFILE: `${BASE_URL}/auth/profile/update`,
};

// ----------------- USERS -----------------
export const USERS = {
    GET_USERS: `${BASE_URL}/users`,
    GET_USER_BY_ID: (id) => `${BASE_URL}/users/${id}`,
    DELETE_USER: (id) => `${BASE_URL}/users/${id}`,
};

// ----------------- TASKS -----------------
export const TASKS = {
    GET_TASKS: `${BASE_URL}/tasks`,
    GET_TASK_BY_ID: (id) => `${BASE_URL}/tasks/${id}`,
    CREATE_TASK: `${BASE_URL}/tasks`,
    UPDATE_TASK: (id) => `${BASE_URL}/tasks/${id}`,
    DELETE_TASK: (id) => `${BASE_URL}/tasks/${id}`,
    UPDATE_TASK_STATUS: (id) => `${BASE_URL}/tasks/${id}/status`,
    UPDATE_TASK_CHECKLIST: (id) => `${BASE_URL}/tasks/${id}/todo`,
    GET_DASHBOARD_DATA: `${BASE_URL}/tasks/dashboard-data`,
    USER_DASHBOARD_DATA: `${BASE_URL}/tasks/user-dashboard-data`,
};

// ----------------- REPORTS -----------------
export const REPORTS = {
    EXPORT_TASKS: `${BASE_URL}/reports/export/tasks`,
    EXPORT_USERS: `${BASE_URL}/reports/export/users`,
};
