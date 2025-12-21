// src/services/api.js
// Centralized API service for DevDash backend

// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

// ==================== AUTH API ====================

export const authAPI = {
    register: (userData) =>
        fetchAPI("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        fetchAPI("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        }),

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

// ==================== CITIZEN API ====================

export const citizenAPI = {
    // Create a new repair request
    createRequest: (requestData) =>
        fetchAPI("/citizen/requests", {
            method: "POST",
            body: JSON.stringify(requestData),
        }),

    // Get a specific request
    getMyRequest: (requestId) =>
        fetchAPI(`/citizen/requests/${requestId}`),

    // Get all applications/assignments for a specific request
    getRequestApplications: (requestId) =>
        fetchAPI(`/citizen/requests/${requestId}/applications`),

    // Get a specific job assignment
    getAssignment: (assignmentId) =>
        fetchAPI(`/citizen/assignments/${assignmentId}`),

    // Accept a worker for a job
    acceptWorker: (requestId, assignmentId) =>
        fetchAPI(`/citizen/requests/${requestId}/accept/${assignmentId}`, {
            method: "POST",
        }),

    // Decline a worker application
    declineWorker: (assignmentId) =>
        fetchAPI(`/citizen/assignments/${assignmentId}/decline`, {
            method: "POST",
        }),

    // Get my repair requests
    getMyRequests: () => fetchAPI("/citizen/requests/my"),

    // Rate a completed job
    rateJob: (requestId, ratingData) =>
        fetchAPI(`/citizen/requests/${requestId}/rate`, {
            method: "POST",
            body: JSON.stringify(ratingData),
        }),
};

// ==================== WORKER API ====================

export const workerAPI = {
    // Get all open repair requests
    getOpenRequests: () => fetchAPI("/worker/requests/open"),

    // Get a specific repair request
    getRequestById: (id) => fetchAPI(`/worker/requests/${id}`),

    // Accept a repair request
    acceptRequest: (requestId, jobData) =>
        fetchAPI(`/worker/requests/${requestId}/accept`, {
            method: "POST",
            body: JSON.stringify(jobData),
        }),

    // Get worker profile by ID
    getWorkerProfileById: (userId) =>
        fetchAPI(`/public/workers/${userId}`),

    // Get my accepted jobs
    getMyJobs: () => fetchAPI("/worker/jobs/my"),

    // Complete a job
    completeJob: (jobId) =>
        fetchAPI(`/worker/jobs/${jobId}/complete`, {
            method: "POST",
        }),

    // Get nearby requests
    getNearbyRequests: (latitude, longitude, radiusKm) =>
        fetchAPI(`/worker/requests/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`),

    // Get worker profile
    getMyProfile: () => fetchAPI("/worker/profile"),

    // Update worker profile
    updateProfile: (profileData) =>
        fetchAPI("/worker/profile", {
            method: "PUT",
            body: JSON.stringify(profileData),
        }),
};

// ==================== ADMIN API ====================

export const adminAPI = {
    // Get all users
    getAllUsers: () => fetchAPI("/admin/users"),

    // Approve worker
    approveWorker: (workerId) =>
        fetchAPI(`/admin/workers/${workerId}/approve`, {
            method: "POST",
        }),

    // Get pending workers
    getPendingWorkers: () => fetchAPI("/admin/workers/pending"),

    // Get all repair requests
    getAllRequests: () => fetchAPI("/admin/requests"),

    // Get system statistics
    getStatistics: () => fetchAPI("/admin/statistics"),
};

// ==================== PUBLIC API ====================

export const publicAPI = {
    // Search workers by skill and location
    searchWorkers: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return fetchAPI(`/public/workers/search?${queryParams}`);
    },

    // Get worker details
    getWorkerDetails: (workerId) => fetchAPI(`/public/workers/${workerId}`),

    // Get categories
    getCategories: () => fetchAPI("/public/categories"),
};

// ==================== UTILITY FUNCTIONS ====================

export const setAuthToken = (token) => {
    localStorage.setItem("token", token);
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Export default object with all APIs
const api = {
    auth: authAPI,
    citizen: citizenAPI,
    worker: workerAPI,
    admin: adminAPI,
    public: publicAPI,
};

export default api;