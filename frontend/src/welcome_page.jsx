import React from "react";
import { Link } from "react-router-dom";
import {Wrench, Users, ShieldCheck, Star, HardHat, Search, User} from "lucide-react";
import "./welcome.css";

const Header = ({ isLoggedIn }) => (
    <header className="topbar">
        <div className="brand">
            <Link
                to="/" className="brand-badge">
                <HardHat size={18} />
            </Link>
            <span className="brand-name" style={{ textDecoration: 'none' }}>HandyConnect</span>
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
                    <User size={16}/>
                    <span>Profile</span>
                </Link>
            )}
        </div>
    </header>
);
const featuredRepairmen = [
    {
        name: "John Doe",
        role: "Certified Electrician",
        rating: 4.8,
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
        name: "Jane Smith",
        role: "Master Plumber",
        rating: 4.9,
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
        name: "Mike Johnson",
        role: "HVAC Specialist",
        rating: 4.7,
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    {
        name: "Emily Davis",
        role: "Skilled Carpenter",
        rating: 4.9,
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
];

export default function WelcomePage({ isLoggedIn }) {
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
                        HandyConnect helps you quickly connect with verified professionals
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
                    <div className="space-y-4">
                        {featuredRepairmen.map((r) => (
                            <div key={r.name} className="flex items-center gap-3">
                                <img src={r.img} alt={r.name} className="avatar" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.role}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                    <Star size={14} />
                                    <span className="font-semibold">{r.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* RIGHT: How it works */}
                <section className="welcome-panel">
                    <div className="welcome-card">
                        <h2>How HandyConnect works</h2>
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
