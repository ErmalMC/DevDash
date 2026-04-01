// src/api/api.js
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
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    };

    // Debug logging
    console.log(`🔍 API Request: ${endpoint}`, {
        method: config.method || 'GET',
        hasToken: !!token,
        userRole: user?.role,
    });

    try {
        const response = await fetch(url, config);

        console.log(`📡 API Response: ${endpoint}`, {
            status: response.status,
            ok: response.ok
        });

        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
            console.warn("⚠️ 401 Unauthorized - Token expired or invalid");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            throw new Error("Session expired. Please login again.");
        }

        // Handle 403 Forbidden - user doesn't have permission
        if (response.status === 403) {
            console.error("🚫 403 Forbidden - Access Denied", {
                endpoint,
                userRole: user?.role,
                expectedRole: endpoint.includes('/worker/') ? 'WORKER' :
                    endpoint.includes('/citizen/') ? 'CITIZEN' :
                        endpoint.includes('/admin/') ? 'ADMIN' : 'unknown',
                hasToken: !!token,
            });

            throw new Error(`Access denied. Required role not found. Your role: ${user?.role || 'unknown'}`);
        }

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
        console.error(`❌ API Error [${endpoint}]:`, error);
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
    getRequestApplications: async (requestId) => {
        console.log('📬 Fetching applications for request:', requestId);
        return fetchAPI(`/citizen/requests/${requestId}/applications`);
    },

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

    // Accept a worker's application
    acceptApplication: async (applicationId) => {
        console.log('✅ Accepting application:', applicationId);
        return fetchAPI(`/citizen/applications/${applicationId}/accept`, {
            method: 'POST',
        });
    },

    // Decline a worker's application
    declineApplication: async (applicationId) => {
        console.log('❌ Declining application:', applicationId);
        return fetchAPI(`/citizen/applications/${applicationId}/decline`, {
            method: 'POST',
        });
    },

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

    // Apply to a repair request - ✅ FIXED with proper data formatting
    applyToRequest: async (requestId, applicationData) => {
        console.log('🔨 Applying to request:', requestId);

        // Format the data properly for backend validation
        const formattedData = {
            message: applicationData.message,
            proposedPrice: applicationData.proposedPrice ? parseFloat(applicationData.proposedPrice) : null,
            estimatedDuration: applicationData.estimatedDuration || null
        };

        console.log('📦 Formatted data:', formattedData);

        return fetchAPI(`/worker/requests/${requestId}/apply`, {
            method: 'POST',
            body: JSON.stringify(formattedData),
        });
    },

    // Get worker's own applications
    getMyApplications: async () => {
        console.log('📋 Fetching worker applications');
        return fetchAPI('/worker/applications');
    },

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

export const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user)?.role || null;
    } catch {
        return null;
    }
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