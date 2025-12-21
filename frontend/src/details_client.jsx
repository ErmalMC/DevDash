// HandymanJobDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HardHat, User, MapPin, Calendar, Clock } from "lucide-react";
import { workerAPI, isAuthenticated } from "./api/api.js";
import "./HandymanJobDetails.css";

const HandymanJobDetails = () => {
    const { id } = useParams(); // Get request ID from URL
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [acceptForm, setAcceptForm] = useState({
        scheduledStart: "",
        scheduledEnd: "",
        estimatedPrice: "",
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        fetchRequestDetails();
    }, [id, isLoggedIn, navigate]);

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            const data = await workerAPI.getRequestById(id);
            setRequest(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching request:", err);
            setError("Failed to load job details");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptJob = async () => {
        if (!acceptForm.scheduledStart || !acceptForm.scheduledEnd || !acceptForm.estimatedPrice) {
            alert("Please fill in all scheduling details");
            return;
        }

        try {
            await workerAPI.acceptRequest(id, {
                scheduledStart: new Date(acceptForm.scheduledStart).toISOString(),
                scheduledEnd: new Date(acceptForm.scheduledEnd).toISOString(),
                estimatedPrice: parseInt(acceptForm.estimatedPrice),
            });

            alert("Job accepted successfully!");
            navigate("/profile");
        } catch (err) {
            console.error("Error accepting job:", err);
            alert(err.message || "Failed to accept job");
        }
    };

    const handleBack = () => {
        navigate("/main");
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

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case "EMERGENCY": return "pill-emergency";
            case "HIGH": return "pill-high";
            case "MEDIUM": return "pill-medium";
            case "LOW": return "pill-low";
            default: return "";
        }
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

    if (error || !request) {
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
                        <button onClick={handleBack} className="btn-primary">
                            Back to Jobs
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

                <div className="flex items-center gap-4">
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
                            <button className="back-button" onClick={handleBack}>
                                <span className="back-arrow">←</span>
                                <span>Back to jobs</span>
                            </button>
                            <h1 className="job-title">
                                {request.description?.substring(0, 60) || "Repair Request"}
                            </h1>
                        </div>

                        <div className="job-meta-row">
                            <span className="pill pill-tag">
                                {getCategoryDisplay(request.category)}
                            </span>

                            <span className={`pill ${getUrgencyColor(request.urgency)}`}>
                                {request.urgency}
                            </span>

                            <span className="dot">•</span>
                            <span className="job-meta-text">
                                Posted {formatTimeAgo(request.createdAt)}
                            </span>
                        </div>

                        <p className="job-status">
                            Status: <span className="job-status-open">{request.status}</span>
                        </p>
                    </section>

                    {/* Location & details */}
                    <section className="section section-row">
                        <div className="rate-details">
                            <div className="rate-line">
                                <MapPin size={16} className="icon-dot" />
                                {request.address}
                            </div>
                            <div className="rate-line">
                                <Calendar size={16} className="icon-dot" />
                                One-time Project
                            </div>
                            <div className="rate-line">
                                <Clock size={16} className="icon-dot" />
                                Flexible timing
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section className="section">
                        <h2 className="section-title">Job Description</h2>
                        <p className="body-text">{request.description}</p>
                    </section>

                    {/* Required Skills */}
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

                    {/* Accept Job Section */}
                    <section className="section">
                        <h2 className="section-title">Accept This Job</h2>

                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Scheduled Start *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={acceptForm.scheduledStart}
                                    onChange={(e) => setAcceptForm(prev => ({
                                        ...prev,
                                        scheduledStart: e.target.value
                                    }))}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Scheduled End *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={acceptForm.scheduledEnd}
                                    onChange={(e) => setAcceptForm(prev => ({
                                        ...prev,
                                        scheduledEnd: e.target.value
                                    }))}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Price Estimate (MKD) *
                                </label>
                                <input
                                    type="number"
                                    value={acceptForm.estimatedPrice}
                                    onChange={(e) => setAcceptForm(prev => ({
                                        ...prev,
                                        estimatedPrice: e.target.value
                                    }))}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="e.g. 2500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-primary" onClick={handleAcceptJob}>
                                Accept Job
                            </button>
                            <button className="btn-outline" onClick={handleBack}>
                                Back to List
                            </button>
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="section">
                        <h2 className="section-title">Tips for Deciding</h2>
                        <div className="tip-row">✓ Review job details carefully</div>
                        <div className="tip-row">✓ Ensure you have the right skills</div>
                        <div className="tip-row">✓ Consider travel time and distance</div>
                        <div className="tip-row">✓ Set a fair price for your work</div>
                    </section>
                </div>

                {/* RIGHT COLUMN – Contact Info */}
                <aside className="right-column">
                    <div className="chat-card">
                        <div className="chat-header">
                            <div>
                                <h2 className="chat-title">Contact Information</h2>
                                <p className="chat-subtitle">
                                    Get in touch after accepting the job
                                </p>
                            </div>
                        </div>

                        <div className="chat-body">
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Location:</strong>
                                </p>
                                <p className="text-sm">{request.address}</p>

                                <p className="text-sm text-gray-600 mt-4 mb-2">
                                    <strong>Urgency Level:</strong>
                                </p>
                                <p className="text-sm">{request.urgency}</p>

                                <p className="text-sm text-gray-600 mt-4">
                                    Contact details will be shared after you accept the job.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default HandymanJobDetails;