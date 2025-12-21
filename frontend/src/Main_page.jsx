// src/Main_page.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Search,
    MapPin,
    Wrench,
    Droplet,
    Wind,
    Hammer,
    PenTool,
    LayoutGrid,
    Lock,
    ChevronUp,
    Clock,
    Menu,
    User,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { workerAPI, citizenAPI, isAuthenticated } from './api/api.js';
import WorkerApplicationModal from './WorkerApplicationModal';
import "./Main_page.css";

const categories = [
    { name: "ELECTRICIAN", displayName: "Electrician", icon: <Wrench size={16} />, sub: "All Electrician Services" },
    { name: "PLUMBER", displayName: "Plumber", icon: <Droplet size={16} />, sub: "All Plumber Services" },
    { name: "AC", displayName: "Air Conditioning", icon: <Wind size={16} />, sub: "All AC Services" },
    { name: "APPLIANCE", displayName: "Appliance Repair", icon: <LayoutGrid size={16} />, sub: "All Appliance Repair Services" },
    { name: "HVAC", displayName: "HVAC", icon: <Wind size={16} />, sub: "All HVAC Services" },
    { name: "CARPENTRY", displayName: "Carpenter", icon: <Hammer size={16} />, sub: "All Carpenter Services" },
    { name: "PAINTING", displayName: "Painter", icon: <PenTool size={16} />, sub: "All Painter Services" },
    { name: "GENERAL_REPAIR", displayName: "Handyman", icon: <Wrench size={16} />, sub: "All Handyman Services" },
    { name: "LOCKSMITH", displayName: "Locksmith", icon: <Lock size={16} />, sub: "All Locksmith Services" },
    { name: "MISCELLANEOUS", displayName: "Miscellaneous", icon: <Lock size={16} />, sub: "All Miscellaneous Services" },
];

const categoryToIcon = (catName) => {
    switch (catName) {
        case "PLUMBING":
        case "PLUMBER":
            return <Droplet size={18} className="text-blue-500" />;
        case "HVAC":
            return <Wind size={18} className="text-blue-500" />;
        case "CARPENTRY":
            return <Hammer size={18} className="text-blue-500" />;
        case "PAINTING":
            return <PenTool size={18} className="text-blue-500" />;
        case "APPLIANCES":
        case "APPLIANCE":
            return <LayoutGrid size={18} className="text-blue-500" />;
        case "LOCKSMITH":
            return <Lock size={18} className="text-blue-500" />;
        case "MISCELLANEOUS":
            return <Lock size={18} className="text-blue-500" />;
        case "ELECTRICAL":
        case "ELECTRICIAN":
        case "GENERAL_REPAIR":
        default:
            return <Wrench size={18} className="text-blue-500" />;
    }
};

const getCategoryDisplayName = (category) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.displayName : category;
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
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
};

// --- Main Page Component ---
export default function Main_page() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [form, setForm] = useState({
        category: "ELECTRICIAN",
        description: "",
        urgency: "MEDIUM",
        address: "",
        latitude: 41.9973,
        longitude: 21.4280,
    });

    // Fetch repair requests from backend
    useEffect(() => {
        fetchRepairRequests();
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "token") {
                setIsLoggedIn(!!e.newValue);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const fetchRepairRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await workerAPI.getOpenRequests();
            setProblems(data || []);
        } catch (err) {
            console.error('Error fetching repair requests:', err);
            if (err.message.includes('Access denied') || err.message.includes('403')) {
                setError('Please log in to view repair requests');
            } else {
                setError(err.message || 'Failed to load repair requests. Please try again later.');
            }
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProblems = useMemo(() => {
        let filtered = problems;

        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        const q = search.trim().toLowerCase();
        if (q) {
            filtered = filtered.filter((p) => {
                return (
                    p.description?.toLowerCase().includes(q) ||
                    p.address?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
                );
            });
        }

        return filtered;
    }, [problems, search, selectedCategory]);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.description.trim() || !form.address.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        if (!isLoggedIn) {
            alert('Please login to create a repair request');
            return;
        }

        try {
            const newRequest = await citizenAPI.createRequest({
                category: form.category,
                description: form.description,
                urgency: form.urgency,
                address: form.address,
                latitude: form.latitude,
                longitude: form.longitude,
            });

            setProblems(prev => [newRequest, ...prev]);

            setForm({
                category: "ELECTRICIAN",
                description: "",
                urgency: "MEDIUM",
                address: "",
                latitude: 41.9973,
                longitude: 21.4280,
            });

            alert('Repair request created successfully!');
        } catch (err) {
            console.error('Error creating repair request:', err);
            alert(err.message || 'Failed to create repair request');
        }
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    };

    // Handle opening the modal
    const handleApplyClick = (problem) => {
        if (!isLoggedIn) {
            alert('Please login to apply for this job');
            return;
        }
        setSelectedRequest(problem);
        setIsModalOpen(true);
    };

    // Handle application submission
    const handleApplicationSubmit = async (formData) => {
        try {
            // Get current user info
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Check if user is a worker - if not, use demo mode
            if (user.role !== 'WORKER') {
                console.log('🎭 Demo Mode: Simulating application submission');

                // Simulate the application being created
                const demoApplication = {
                    id: Date.now(),
                    repairRequest: selectedRequest,
                    worker: {
                        id: user.id,
                        fullName: user.fullName || 'Demo Worker',
                        email: user.email
                    },
                    message: formData.message,
                    proposedPrice: formData.proposedPrice ? parseFloat(formData.proposedPrice) : null,
                    estimatedDuration: formData.estimatedDuration,
                    status: 'PENDING',
                    createdAt: new Date().toISOString()
                };

                // Store in localStorage for demo
                const existingApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');
                existingApps.push(demoApplication);
                localStorage.setItem('demoApplications', JSON.stringify(existingApps));

                // Show success message with details
                const message = `✅ Application Submitted Successfully! (Demo Mode)

Job: ${selectedRequest.description?.substring(0, 60)}...
Category: ${getCategoryDisplayName(selectedRequest.category)}
Location: ${selectedRequest.address}

Your Offer:
${formData.proposedPrice ? `💰 Price: ${formData.proposedPrice} MKD\n` : ''}${formData.estimatedDuration ? `⏱️ Duration: ${formData.estimatedDuration}\n` : ''}
📝 Message: "${formData.message}"

✨ This application is now visible in your profile!
(In production, only WORKER role users can apply)`;

                alert(message);
                setIsModalOpen(false);
                setSelectedRequest(null);
                return;
            }

            // Real API call for actual workers
            await workerAPI.applyToRequest(selectedRequest.id, formData);

            // Show success message with details
            const message = `✅ Application Submitted Successfully!

Job: ${selectedRequest.description?.substring(0, 60)}...
Category: ${getCategoryDisplayName(selectedRequest.category)}
Location: ${selectedRequest.address}

Your Offer:
${formData.proposedPrice ? `💰 Price: ${formData.proposedPrice} MKD\n` : ''}${formData.estimatedDuration ? `⏱️ Duration: ${formData.estimatedDuration}\n` : ''}
📝 Message: "${formData.message}"

The citizen will review your application and contact you if interested.`;

            alert(message);
            setIsModalOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert(error.message || 'Failed to submit application');
            throw error;
        }
    };

    // --- Components ---
    const SidebarItem = ({ cat, onCategorySelect, selectedCategory }) => {
        const isSelected = selectedCategory === cat.name;

        return (
            <div className="mb-4">
                <div
                    className={`flex items-center justify-between cursor-pointer mb-2 ${
                        isSelected ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-blue-400">{cat.icon}</span>
                        <span className="text-sm font-semibold">{cat.displayName}</span>
                    </div>
                </div>

                <div className="pl-8">
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-blue-500">
                        <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-500"
                            checked={isSelected}
                            onChange={() => onCategorySelect(cat.name)}
                        />
                        {cat.sub}
                    </label>
                </div>
            </div>
        );
    };

    const ProblemCard = ({ problem }) => (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    {categoryToIcon(problem.category)}
                    <h3 className="text-lg font-bold text-gray-900">{problem.description?.substring(0, 50) || 'Repair Request'}</h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                    problem.urgency === 'EMERGENCY' ? 'bg-red-100 text-red-600' :
                    problem.urgency === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                    problem.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                }`}>
                    {problem.urgency}
                </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {problem.address}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(problem.createdAt)}
                </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {problem.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-600">
                    Category: <span className="font-semibold">{getCategoryDisplayName(problem.category)}</span>
                </span>
                <button
                    onClick={() => handleApplyClick(problem)}
                    className="bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Apply to Fix
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <header className="page-header flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900">HandyConnect</h1>
                </div>

                <div className="flex items-center gap-4">
                    {!isLoggedIn && (
                        <Link
                            to="/register"
                            className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 border border-gray-200 rounded-lg"
                        >
                            Register
                        </Link>
                    )}

                    {!isLoggedIn ? (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg"
                        >
                            Login
                        </Link>
                    ) : (
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2 border border-gray-200 rounded-lg"
                        >
                            <User size={16} />
                            <span>Profile</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* 3 columns: Left = Categories, Middle = Form + Problems, Right = Overview */}
            <main className="page-main px-6 py-6 grid-main">
                {/* LEFT: Categories */}
                <aside className="panel panel-cats bg-white rounded-xl border border-gray-100 p-4 h-fit">
                    <h2 className="text-sm font-bold text-gray-800 mb-4">Categories</h2>
                    {categories.map((cat) => (
                        <SidebarItem
                            key={cat.name}
                            cat={cat}
                            onCategorySelect={handleCategorySelect}
                            selectedCategory={selectedCategory}
                        />
                    ))}
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 text-xs text-blue-500 hover:text-blue-600"
                        >
                            Clear filter
                        </button>
                    )}
                </aside>

                {/* MIDDLE: Create Problem + Open Problems */}
                <section className="space-y-4 panel-problems">
                    {/* Create problem form */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Create a Problem Request</h2>
                        </div>

                        <form onSubmit={onSubmit} className="form-grid">
                            <div className="form-field">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                >
                                    {categories.map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Urgency</label>
                                <select
                                    className="form-input"
                                    value={form.urgency}
                                    onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value }))}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="EMERGENCY">Emergency</option>
                                </select>
                            </div>

                            <div className="form-field form-field--full">
                                <label className="form-label">Address</label>
                                <input
                                    className="form-input"
                                    value={form.address}
                                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                    placeholder="e.g. Ul. Makedonija 23, Skopje"
                                    required
                                />
                            </div>

                            <div className="form-field form-field--full">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="Describe the issue and any important details..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                {isLoggedIn ? (
                                    <button type="submit" className="btn-primary">
                                        Submit Request
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn-primary inline-block text-center"
                                    >
                                        Login to Submit
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Problems header + search */}
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900">Open Problems</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs text-gray-600">
                                <Search size={14} />
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    className="outline-none text-xs bg-transparent"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="text-center py-8 text-gray-500">
                            Loading repair requests...
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                            {error}
                            <button
                                onClick={fetchRepairRequests}
                                className="ml-4 text-sm underline hover:no-underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Problems Grid */}
                    {!loading && !error && (
                        <div className="grid gap-4">
                            {filteredProblems.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
                                    No repair requests found. {selectedCategory && 'Try clearing the category filter.'}
                                </div>
                            ) : (
                                filteredProblems.map((p) => (
                                    <ProblemCard key={p.id} problem={p} />
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/* RIGHT: Overview */}
                <aside className="bg-white rounded-xl border border-gray-100 p-4 h-fit panel-overview">
                    <h2 className="text-sm font-bold text-gray-800 mb-4">Overview</h2>

                    <div className="widget">
                        <p className="widget-title">Quick stats</p>

                        <div className="stat-row">
                            <span className="text-gray-500 text-sm">Open problems</span>
                            <span className="stat-value">{filteredProblems.length}</span>
                        </div>

                        <div className="stat-row">
                            <span className="text-gray-500 text-sm">Total problems</span>
                            <span className="stat-value">{problems.length}</span>
                        </div>

                        <div className="stat-row">
                            <span className="text-gray-500 text-sm">Selected category</span>
                            <span className="stat-value">
                                {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'All'}
                            </span>
                        </div>
                    </div>

                    <div className="widget">
                        <p className="widget-title">Posting tips</p>
                        <ul className="tips">
                            <li>Add exact location and access info.</li>
                            <li>Include photos for faster quotes.</li>
                            <li>Write what you already tried (breaker reset, etc.).</li>
                            <li>Select appropriate urgency level.</li>
                        </ul>
                    </div>
                </aside>
            </main>

            {/* Worker Application Modal */}
            <WorkerApplicationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRequest(null);
                }}
                onSubmit={handleApplicationSubmit}
                requestDetails={selectedRequest}
            />
        </div>
    );
}