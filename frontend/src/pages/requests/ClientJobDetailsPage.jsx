// ClientDetailsForJob.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HardHat, User, MapPin, Calendar, Clock, Star } from "lucide-react";
import { citizenAPI, workerAPI, isAuthenticated } from '../../shared/api/apiClient.js';
import './JobDetailsShared.css';

const ClientDetailsForJob = () => {
    const { requestId, assignmentId } = useParams(); // Get IDs from URL
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
    const [request, setRequest] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        fetchJobDetails();
    }, [requestId, assignmentId, isLoggedIn, navigate]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);

            // Fetch the repair request
            const requestData = await citizenAPI.getMyRequest(requestId);
            setRequest(requestData);

            // Fetch the job assignment (worker who applied)
            const assignmentData = await citizenAPI.getAssignment(assignmentId);
            setAssignment(assignmentData);

            // Fetch worker profile details
            const workerData = await workerAPI.getWorkerProfileById(assignmentData.workerId);
            setWorker(workerData);

            setError(null);
        } catch (err) {
            console.error("Error fetching job details:", err);
            setError("Failed to load job details");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptWorker = async () => {
        if (!window.confirm(`Accept ${worker?.fullName} for this job?`)) {
            return;
        }

        try {
            await citizenAPI.acceptWorker(requestId, assignmentId);
            alert("Worker accepted! Job is now assigned.");
            navigate("/my-requests");
        } catch (err) {
            console.error("Error accepting worker:", err);
            alert(err.message || "Failed to accept worker");
        }
    };

    const handleDeclineWorker = async () => {
        if (!window.confirm(`Decline ${worker?.fullName}?`)) {
            return;
        }

        try {
            await citizenAPI.declineWorker(assignmentId);
            alert("Worker declined");
            navigate("/my-requests");
        } catch (err) {
            console.error("Error declining worker:", err);
            alert(err.message || "Failed to decline worker");
        }
    };

    const getCategoryDisplay = (category) => {
        const map = {
            "ELECTRICAL": "Electrician",
            "PLUMBING": "Plumber",
            "CARPENTRY": "Carpenter",
            "PAINTING": "Painter",
            "HVAC": "HVAC",
            "APPLIANCES": "Appliance Repair",
            "LOCKSMITH": "Locksmith",
            "GENERAL_REPAIR": "Handyman",
        };
        return map[category] || category;
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffMs = now - created;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return "Less than an hour ago";
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "TBD";
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="page">
                <header className="topbar">
                    <div className="logo-block">
                        <Link to="/" className="brand-badge">
                            <HardHat size={18} />
                        </Link>
                        <span className="brand-name">DevDash</span>
                    </div>
                </header>
                <main className="layout">
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading job details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !request || !assignment || !worker) {
        return (
            <div className="page">
                <header className="topbar">
                    <div className="logo-block">
                        <Link to="/" className="brand-badge">
                            <HardHat size={18} />
                        </Link>
                        <span className="brand-name">DevDash</span>
                    </div>
                </header>
                <main className="layout">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error || "Job not found"}</p>
                        <button onClick={() => navigate("/my-requests")} className="btn-primary">
                            Back to My Requests
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page">
            {/* Top bar */}
            <header className="topbar">
                <div className="logo-block">
                    <Link to="/" className="brand-badge">
                        <HardHat size={18} />
                    </Link>
                    <span className="brand-name">DevDash</span>
                </div>

                <div className="topbar-search-wrapper">
                    <input
                        className="topbar-search"
                        placeholder="Search jobs, clients, or skills..."
                    />
                </div>

                <div className="right">
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2 border border-gray-200 rounded-lg"
                    >
                        <User size={16} />
                        <span>Profile</span>
                    </Link>
                </div>
            </header>

            <main className="layout">
                {/* LEFT COLUMN */}
                <div className="left-column">
                    {/* Back + Title + meta */}
                    <section className="section section-header">
                        <div className="header-row">
                            <button
                                className="back-button"
                                onClick={() => navigate("/my-requests")}
                            >
                                <span className="back-arrow">←</span>
                                <span>Back to my requests</span>
                            </button>
                            <h1 className="job-title">
                                {request.description?.substring(0, 60) || "Repair Request"}
                            </h1>
                        </div>

                        <div className="job-meta-row">
                            <span className="pill pill-tag">
                                {getCategoryDisplay(request.category)}
                            </span>

                            <span className="pill pill-verified">Your Request</span>

                            <span className="dot">•</span>
                            <span className="job-meta-text">
                                Posted {formatTimeAgo(request.createdAt)}
                            </span>
                        </div>

                        <p className="job-status">
                            Status: <span className="job-status-open">{request.status}</span>
                        </p>
                    </section>

                    {/* Rate + schedule */}
                    <section className="section section-row">
                        <div className="rate-block">
                            <div className="rate-amount">{assignment.finalPrice || "TBD"} MKD</div>
                            <div className="rate-label">Worker's Estimate</div>
                        </div>
                        <div className="rate-details">
                            <div className="rate-line">
                                <MapPin size={16} className="icon-dot" />
                                {request.address}
                            </div>
                            <div className="rate-line">
                                <Calendar size={16} className="icon-dot" />
                                {formatDateTime(assignment.scheduledStart)} - {formatDateTime(assignment.scheduledEnd)}
                            </div>
                            <div className="rate-line">
                                <Clock size={16} className="icon-dot" />
                                One-time Project
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section className="section">
                        <h2 className="section-title">Job Description</h2>
                        <p className="body-text">{request.description}</p>
                    </section>

                    {/* Skills */}
                    <section className="section">
                        <h2 className="section-title">Required Skills</h2>
                        <div className="tags-row">
                            <span className="pill pill-chip">
                                {getCategoryDisplay(request.category)}
                            </span>
                            <span className="pill pill-chip">Professional Tools</span>
                            <span className="pill pill-chip">Customer Service</span>
                        </div>
                    </section>

                    {/* Handyman summary */}
                    <section className="section">
                        <h2 className="section-title">Worker Who Applied</h2>
                        <div className="selected-handyman-row">
                            <div className="selected-handyman-main">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.fullName}`}
                                    alt={worker.fullName}
                                    className="avatar-large"
                                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                                />
                                <div>
                                    <div className="selected-handyman-name">{worker.fullName}</div>
                                    <div className="selected-handyman-meta">
                                        <Star size={14} className="inline" fill="gold" stroke="gold" />
                                        {worker.ratingAverage?.toFixed(1) || "0.0"} ·
                                        {worker.ratingCount || 0} reviews ·
                                        {worker.title || "Professional Worker"}
                                    </div>
                                </div>
                            </div>
                            <Link to={`/worker-profile/${worker.userId}`} className="link-button">
                                View full profile
                            </Link>
                        </div>
                    </section>

                    {/* Worker stats */}
                    <section className="section score-row">
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">
                                {worker.ratingAverage?.toFixed(1) || "0.0"}
                            </div>
                            <div className="score-label">Average Rating</div>
                        </div>
                        <div className="score-block score-block-border">
                            <div className="score-icon" />
                            <div className="score-value">{worker.ratingCount || 0}</div>
                            <div className="score-label">Reviews</div>
                        </div>
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">{worker.serviceRadiusKm || 0} km</div>
                            <div className="score-label">Service Radius</div>
                        </div>
                    </section>

                    {/* Your decision */}
                    <section className="section">
                        <h2 className="section-title">Your Decision</h2>
                        <p className="body-text">
                            Review this worker's details, proposed schedule, and pricing before deciding.
                        </p>
                        <div className="action-buttons">
                            <button className="btn-primary" onClick={handleAcceptWorker}>
                                Accept Worker
                            </button>
                            <button className="btn-outline" onClick={handleDeclineWorker}>
                                Decline
                            </button>
                        </div>
                        <div className="action-meta">
                            <span>Estimated Cost: {assignment.finalPrice} MKD</span>
                            <span>Scheduled: {formatDateTime(assignment.scheduledStart)}</span>
                            <span>Free cancellation up to 24 hours before</span>
                        </div>
                    </section>

                    {/* Safety & payment */}
                    <section className="section">
                        <h2 className="section-title">Safety &amp; Payment Protection</h2>
                        <div className="safety-row">
                            <span>🔒 Secure payments held in escrow</span>
                            <span>✔ Worker identity verified</span>
                            <button className="link-danger">Report this profile</button>
                        </div>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Tips for Deciding</h2>
                        <div className="tip-row">✓ Compare worker ratings & reviews</div>
                        <div className="tip-row">✓ Check response time and communication</div>
                        <div className="tip-row">✓ Confirm availability and schedule</div>
                        <div className="tip-row">✓ Review pricing estimate</div>
                    </section>
                </div>

                {/* RIGHT COLUMN – Contact info */}
                <aside className="right-column">
                    <div className="chat-card">
                        <div className="chat-header">
                            <div>
                                <h2 className="chat-title">Worker Details</h2>
                                <p className="chat-subtitle">
                                    Contact information will be shared after acceptance
                                </p>
                            </div>
                        </div>

                        <div className="chat-body">
                            <div className="p-4 bg-gray-50 rounded space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Worker:</p>
                                    <p className="text-sm">{worker.fullName}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {worker.skills?.map(skill => (
                                            <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {getCategoryDisplay(skill)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Hourly Rate:</p>
                                    <p className="text-sm">{worker.hourlyRateMin} - {worker.hourlyRateMax} MKD/hr</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Service Area:</p>
                                    <p className="text-sm">{worker.serviceRadiusKm} km radius</p>
                                </div>

                                <p className="text-xs text-gray-500 mt-4">
                                    Full contact details will be provided after you accept this worker.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ClientDetailsForJob;