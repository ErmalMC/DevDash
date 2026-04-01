// src/pages/RequestDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, User as UserIcon } from 'lucide-react';
import { workerAPI, getUserRole, isAuthenticated } from './shared/api/apiClient.js';
import WorkerApplicationModal from './features/applications/components/WorkerApplicationModal.jsx';
import ApplicationsList from './features/applications/components/ApplicationsList.jsx';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchRequestDetails();
        setUserRole(getUserRole());
    }, [id]);

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await workerAPI.getRequestById(id);
            setRequest(data);

            // Check if current user is the owner (citizen who posted it)
            // This would require additional API call or user info in response

        } catch (err) {
            console.error('Error fetching request:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (applicationData) => {
        try {
            await workerAPI.applyToRequest(id, applicationData);
            alert('Application sent successfully!');
            setShowApplicationModal(false);
            // Optionally refresh the request to show updated status
            fetchRequestDetails();
        } catch (err) {
            throw new Error(err.message || 'Failed to send application');
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading request details...</div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p className="error-message">
                        {error || 'Request not found'}
                    </p>
                    <button onClick={() => navigate('/')} className="btn-back">
                        ← Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    const isWorker = userRole === 'WORKER';
    const isCitizen = userRole === 'CITIZEN';
    const isLoggedIn = isAuthenticated();

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <button onClick={() => navigate('/')} className="btn-back-header">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1>Request Details</h1>
            </div>

            <div className="detail-container">
                {/* Main Content */}
                <div className="detail-main">
                    {/* Request Card */}
                    <div className="request-card">
                        <div className="request-header">
                            <div>
                                <div className="request-category">{request.category}</div>
                                <span className={`urgency-badge urgency-${request.urgency.toLowerCase()}`}>
                                    {request.urgency}
                                </span>
                            </div>
                            <span className="request-status">{request.status}</span>
                        </div>

                        <div className="request-meta">
                            <div className="meta-item">
                                <MapPin size={16} />
                                {request.address}
                            </div>
                            <div className="meta-item">
                                <Clock size={16} />
                                {formatTimeAgo(request.createdAt)}
                            </div>
                            <div className="meta-item">
                                <UserIcon size={16} />
                                {request.citizen?.fullName || 'Anonymous'}
                            </div>
                        </div>

                        <div className="request-description">
                            <h2>Description</h2>
                            <p>{request.description}</p>
                        </div>

                        {/* Worker Action Button */}
                        {isWorker && request.status === 'OPEN' && (
                            <div className="action-section">
                                <button
                                    onClick={() => setShowApplicationModal(true)}
                                    className="btn-apply"
                                >
                                    Apply to Fix This Request
                                </button>
                            </div>
                        )}

                        {!isLoggedIn && (
                            <div className="login-prompt">
                                <p>Please log in as a worker to apply for this request</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn-login"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Applications Section (visible to citizen who posted) */}
                    {isCitizen && (
                        <ApplicationsList requestId={id} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    <div className="sidebar-card">
                        <h3>Request Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="info-value">{request.status}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Category</span>
                                <span className="info-value">{request.category}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Urgency</span>
                                <span className="info-value">{request.urgency}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Posted</span>
                                <span className="info-value">{formatTimeAgo(request.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {isWorker && (
                <WorkerApplicationModal
                    isOpen={showApplicationModal}
                    onClose={() => setShowApplicationModal(false)}
                    requestDetails={request}
                    onSubmit={handleApply}
                />
            )}
        </div>
    );
};

export default RequestDetailPage;