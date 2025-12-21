// src/components/ApplicationsList.jsx
import React, { useState, useEffect } from 'react';
import { User, Clock, DollarSign, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { citizenAPI } from '../api/api';
import './ApplicationsList.css';

const ApplicationsList = ({ requestId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [requestId]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await citizenAPI.getRequestApplications(requestId);
            setApplications(data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (applicationId) => {
        if (!confirm('Are you sure you want to accept this worker? This will assign them to your request.')) {
            return;
        }

        try {
            await citizenAPI.acceptApplication(applicationId);
            alert('Worker accepted successfully!');
            fetchApplications(); // Refresh list
        } catch (err) {
            alert(err.message || 'Failed to accept worker');
        }
    };

    const handleDecline = async (applicationId) => {
        if (!confirm('Are you sure you want to decline this application?')) {
            return;
        }

        try {
            await citizenAPI.declineApplication(applicationId);
            alert('Application declined');
            fetchApplications(); // Refresh list
        } catch (err) {
            alert(err.message || 'Failed to decline application');
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
        return <div className="applications-loading">Loading applications...</div>;
    }

    if (error) {
        return <div className="applications-error">Error: {error}</div>;
    }

    if (applications.length === 0) {
        return (
            <div className="no-applications">
                <MessageSquare size={48} className="no-apps-icon" />
                <p>No applications yet</p>
                <span className="no-apps-sub">Workers will see your request and can apply to fix it</span>
            </div>
        );
    }

    return (
        <div className="applications-container">
            <h3 className="applications-title">
                Worker Applications ({applications.length})
            </h3>

            <div className="applications-list">
                {applications.map((app) => (
                    <div key={app.id} className={`application-card status-${app.status.toLowerCase()}`}>
                        {/* Worker Info */}
                        <div className="app-header">
                            <div className="worker-info">
                                <div className="worker-avatar">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="worker-name">{app.worker.fullName}</h4>
                                    <span className="app-time">{formatTimeAgo(app.createdAt)}</span>
                                </div>
                            </div>
                            <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                {app.status}
                            </span>
                        </div>

                        {/* Message */}
                        <div className="app-message">
                            <MessageSquare size={16} />
                            <p>{app.message}</p>
                        </div>

                        {/* Price and Duration */}
                        {(app.proposedPrice || app.estimatedDuration) && (
                            <div className="app-details">
                                {app.proposedPrice && (
                                    <div className="detail-item">
                                        <DollarSign size={16} />
                                        <span>{app.proposedPrice} MKD</span>
                                    </div>
                                )}
                                {app.estimatedDuration && (
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{app.estimatedDuration}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions (only for pending applications) */}
                        {app.status === 'PENDING' && (
                            <div className="app-actions">
                                <button
                                    onClick={() => handleDecline(app.id)}
                                    className="btn-decline"
                                >
                                    <XCircle size={16} />
                                    Decline
                                </button>
                                <button
                                    onClick={() => handleAccept(app.id)}
                                    className="btn-accept"
                                >
                                    <CheckCircle size={16} />
                                    Accept Worker
                                </button>
                            </div>
                        )}

                        {/* Response Time (for accepted/declined) */}
                        {app.respondedAt && (
                            <div className="responded-at">
                                {app.status === 'ACCEPTED' ? 'Accepted' : 'Declined'} {formatTimeAgo(app.respondedAt)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationsList;