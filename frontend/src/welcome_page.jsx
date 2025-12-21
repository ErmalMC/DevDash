import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Users, ShieldCheck, Star, HardHat, Search, User } from "lucide-react";
import { isAuthenticated } from "./services/api";
import "./welcome.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const Header = ({ isLoggedIn }) => (
    <header className="topbar">
        <div className="brand">
            <Link to="/" className="brand-badge">
                <HardHat size={18} />
            </Link>
            <span className="brand-name" style={{ textDecoration: 'none' }}>DevDash</span>
        </div>

        <div className="search">
            <Search className="search-icon" size={18} />
            <input className="search-input" placeholder="Search handymen or services..." />
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
);

export default function WelcomePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
    const [topWorkers, setTopWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth changes
        const onStorage = (e) => {
            if (e.key === "token") {
                setIsLoggedIn(!!e.newValue);
            }
        };
        window.addEventListener("storage", onStorage);

        // Redirect if already logged in
        if (isLoggedIn) {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.role === "WORKER") {
                navigate("/profile");
            } else {
                navigate("/main");
            }
        }

        // Fetch top workers
        fetchTopWorkers();

        return () => window.removeEventListener("storage", onStorage);
    }, [isLoggedIn, navigate]);

    const fetchTopWorkers = async () => {
        try {
            setLoading(true);
            // Fetch top-rated workers from backend
            const response = await fetch(`${API_BASE_URL}/public/workers/top?limit=4`);

            if (response.ok) {
                const data = await response.json();
                setTopWorkers(data);
            } else {
                // Fallback to mock data if endpoint doesn't exist yet
                setTopWorkers(getMockWorkers());
            }
        } catch (error) {
            console.error("Error fetching top workers:", error);
            // Use mock data on error
            setTopWorkers(getMockWorkers());
        } finally {
            setLoading(false);
        }
    };

    const getMockWorkers = () => [
        {
            id: "1",
            fullName: "Alex Thompson",
            title: "Certified Electrician",
            ratingAverage: 4.8,
            ratingCount: 23,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        {
            id: "2",
            fullName: "Maria Garcia",
            title: "Master Plumber",
            ratingAverage: 4.9,
            ratingCount: 31,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        },
        {
            id: "3",
            fullName: "James Anderson",
            title: "HVAC Specialist",
            ratingAverage: 4.7,
            ratingCount: 18,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        },
        {
            id: "4",
            fullName: "Lisa Martinez",
            title: "Skilled Carpenter",
            ratingAverage: 4.9,
            ratingCount: 27,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        },
    ];

    return (
        <div className="page">
            <Header isLoggedIn={isLoggedIn} />

            <main className="welcome-hero">
                {/* LEFT: Hero text */}
                <section className="welcome-content">
                    <h1 className="welcome-title">
                        Find trusted handymen for every job.
                    </h1>
                    <p className="welcome-subtitle">
                        DevDash helps you quickly connect with verified professionals
                        for repairs, installations, and maintenance in your area.
                    </p>

                    <div className="welcome-actions">
                        <Link to="/register" className="welcome-primary-btn">
                            Get started
                        </Link>

                        <Link to="/login" className="welcome-secondary-btn">
                            I already have an account
                        </Link>
                    </div>

                    <div className="welcome-highlights">
                        <div className="welcome-highlight">
                            <Wrench size={22} />
                            <span>Skilled professionals for every trade</span>
                        </div>
                        <div className="welcome-highlight">
                            <ShieldCheck size={22} />
                            <span>Verified & reviewed workers</span>
                        </div>
                        <div className="welcome-highlight">
                            <Users size={22} />
                            <span>Transparent pricing and communication</span>
                        </div>
                    </div>
                </section>

                {/* MIDDLE: Top repairmen */}
                <aside className="panel panel-top bg-white rounded-xl border border-gray-100 p-4 h-fit">
                    <h2 className="text-sm font-bold text-gray-800 mb-4">Top Repairmen</h2>

                    {loading ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            Loading top workers...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topWorkers.map((worker) => (
                                <div key={worker.id || worker.fullName} className="flex items-center gap-3">
                                    <img
                                        src={worker.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.fullName}`}
                                        alt={worker.fullName}
                                        className="avatar"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {worker.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {worker.title || "Professional Worker"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-semibold">
                                            {worker.ratingAverage?.toFixed(1) || "0.0"}
                                        </span>
                                        <span className="text-gray-400">
                                            ({worker.ratingCount || 0})
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>

                {/* RIGHT: How it works */}
                <section className="welcome-panel">
                    <div className="welcome-card">
                        <h2>How DevDash works</h2>
                        <ul>
                            <li>Tell us what you need fixed or installed.</li>
                            <li>Browse nearby, rated professionals.</li>
                            <li>Book, chat, and track your job in one place.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}