// src/MyApplications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, MessageSquare, DollarSign, Clock, MapPin, Calendar } from 'lucide-react';
import './MyApplicationsPage.css';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        setLoading(true);

        // Load from localStorage (demo mode)
        const demoApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');

        // Sort by newest first
        const sorted = demoApps.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setApplications(sorted);
        setLoading(false);
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    const getCategoryDisplayName = (category) => {
        const categories = {
            'ELECTRICIAN': 'Electrician',
            'PLUMBER': 'Plumber',
            'AC': 'Air Conditioning',
            'APPLIANCE': 'Appliance Repair',
            'HVAC': 'HVAC',
            'CARPENTRY': 'Carpenter',
            'PAINTING': 'Painter',
            'GENERAL_REPAIR': 'Handyman',
            'LOCKSMITH': 'Locksmith',
            'MISCELLANEOUS': 'Miscellaneous'
        };
        return categories[category] || category;
    };

    if (loading) {
        return (
            <div className="applications-page">
                <div className="loading-state">Loading your applications...</div>
            </div>
        );
    }

    return (
        <div className="applications-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-content">
                    <Link to="/profile" className="back-button">
                        <ArrowLeft size={20} />
                        Back to Profile
                    </Link>
                    <h1 className="page-title">My Applications</h1>
                    <p className="page-subtitle">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
                    </p>
                </div>
            </header>

            {/* Applications List */}
            <main className="applications-main">
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <MessageSquare size={64} className="empty-icon" />
                        <h2>No Applications Yet</h2>
                        <p>Start applying to repair requests to see them here</p>
                        <Link to="/" className="btn-primary">
                            Browse Repair Requests
                        </Link>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map((app) => (
                            <div key={app.id} className="application-card">
                                {/* Status Badge */}
                                <div className="card-header">
                                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                    <span className="time-ago">
                                        <Clock size={14} />
                                        {formatTimeAgo(app.createdAt)}
                                    </span>
                                </div>

                                {/* Request Info */}
                                <div className="request-info">
                                    <h3 className="request-title">
                                        {app.repairRequest.description?.substring(0, 80)}
                                        {app.repairRequest.description?.length > 80 ? '...' : ''}
                                    </h3>

                                    <div className="request-meta">
                                        <span className="meta-item">
                                            <MapPin size={14} />
                                            {app.repairRequest.address}
                                        </span>
                                        <span className="category-badge">
                                            {getCategoryDisplayName(app.repairRequest.category)}
                                        </span>
                                    </div>
                                </div>

                                {/* Application Details */}
                                <div className="application-details">
                                    <div className="detail-section">
                                        <MessageSquare size={16} className="detail-icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Your Message:</span>
                                            <p className="detail-text">{app.message}</p>
                                        </div>
                                    </div>

                                    {(app.proposedPrice || app.estimatedDuration) && (
                                        <div className="offer-details">
                                            {app.proposedPrice && (
                                                <div className="offer-item">
                                                    <DollarSign size={16} />
                                                    <span>{app.proposedPrice} MKD</span>
                                                </div>
                                            )}
                                            {app.estimatedDuration && (
                                                <div className="offer-item">
                                                    <Clock size={16} />
                                                    <span>{app.estimatedDuration}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="card-footer">
                                    {app.status === 'PENDING' && (
                                        <span className="waiting-text">Waiting for citizen response...</span>
                                    )}
                                    {app.status === 'ACCEPTED' && (
                                        <span className="success-text">✓ Your application was accepted!</span>
                                    )}
                                    {app.status === 'DECLINED' && (
                                        <span className="declined-text">Application was declined</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplications;