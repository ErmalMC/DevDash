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
    Star,
    Clock,
    Menu,
    User,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Main_page.css";

// --- Mock Data (initial) ---
const initialProblems = [
    {
        id: 1,
        title: "Leaky Faucet in Kitchen",
        location: "New York, NY",
        time: "2 hours ago",
        description:
            "The kitchen faucet has been dripping constantly for two days. Need someone to come and fix it quickly, preferably this week. It's a standard mixer tap.",
        price: "$150.00",
        icon: <Droplet size={18} className="text-blue-500" />,
        category: "Plumbing",
    },
    {
        id: 2,
        title: "Power Outlet Not Working in Bedroom",
        location: "Los Angeles, CA",
        time: "5 hours ago",
        description:
            "One of the power outlets in the master bedroom stopped working. Tried resetting the breaker, but it did not help. Looking for an electrician to diagnose and repair.",
        price: "$200.00",
        icon: <Wrench size={18} className="text-blue-500" />,
        category: "Electrical",
    },
    {
        id: 3,
        title: "Broken Door Frame Repair",
        location: "Houston, TX",
        time: "2 days ago",
        description:
            "The door frame for the bathroom is cracked and needs to be repaired or replaced. It is a standard interior door. Seeking a carpenter for the job.",
        price: "$250.00",
        icon: <Hammer size={18} className="text-blue-500" />,
        category: "Carpenter",
    },
    {
        id: 4,
        title: "Small Bathroom Repaint Job",
        location: "Phoenix, AZ",
        time: "3 days ago",
        description:
            "Looking to get my small bathroom repainted. Walls are currently light blue, want to change to off-white. Approximately 5x8 feet in size. Paint provided.",
        price: "$180.00",
        icon: <PenTool size={18} className="text-blue-500" />,
        category: "Painting",
    },
    {
        id: 5,
        title: "Loose Shelf Installation",
        location: "Seattle, WA",
        time: "5 days ago",
        description:
            "Need help installing two floating shelves in my living room. Walls are drywall. I have the shelves and hardware, just need someone with tools and experience.",
        price: "$100.00",
        icon: <Wrench size={18} className="text-blue-500" />,
        category: "Handyman",
    },
    {
        id: 6,
        title: "Broken Cabinet Hinge Replacement",
        location: "New York, NY",
        time: "1 week ago",
        description:
            "One of the kitchen cabinet door hinges broke. Need a handyman to replace it. I have a new hinge, just need assistance with the installation.",
        price: "$80.00",
        icon: <Hammer size={18} className="text-blue-500" />,
        category: "Handyman",
    },
];

const categories = [
    { name: "Electrician", icon: <Wrench size={16} />, sub: "All Electrician Services" },
    { name: "Plumber", icon: <Droplet size={16} />, sub: "All Plumber Services" },
    { name: "HVAC Technician", icon: <Wind size={16} />, sub: "All HVAC Technician Services" },
    { name: "Carpenter", icon: <Hammer size={16} />, sub: "All Carpenter Services" },
    { name: "Painter", icon: <PenTool size={16} />, sub: "All Painter Services" },
    { name: "Appliance Repair", icon: <LayoutGrid size={16} />, sub: "All Appliance Repair Services" },
    { name: "Handyman", icon: <Wrench size={16} />, sub: "All Handyman Services" },
    { name: "Locksmith", icon: <Lock size={16} />, sub: "All Locksmith Services" },
];

// --- Components ---
const SidebarItem = ({ cat }) => (
    <div className="mb-4">
        <div className="flex items-center justify-between text-gray-700 hover:text-blue-500 cursor-pointer mb-2">
            <div className="flex items-center gap-3">
                <span className="text-blue-400">{cat.icon}</span>
                <span className="text-sm font-semibold">{cat.name}</span>
            </div>
            <ChevronUp size={14} className="text-gray-400" />
        </div>

        <div className="pl-8">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-blue-500">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-500" />
                {cat.sub}
            </label>
        </div>
    </div>
);

const ProblemCard = ({ problem }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                {problem.icon}
                <h3 className="text-lg font-bold text-gray-900">{problem.title}</h3>
            </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
                <MapPin size={12} />
                {problem.location}
            </div>
            <div className="flex items-center gap-1">
                <Clock size={12} />
                {problem.time}
            </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
            {problem.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
            <span className="text-blue-500 font-bold text-lg">{problem.price}</span>
            <Link
                to={`/dhandyman/${problem.id}`}
                className="bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Apply to Fix
            </Link>
        </div>
    </div>
);

const categoryToIcon = (catName) => {
    switch (catName) {
        case "Plumber":
            return <Droplet size={18} className="text-blue-500" />;
        case "HVAC Technician":
            return <Wind size={18} className="text-blue-500" />;
        case "Carpenter":
            return <Hammer size={18} className="text-blue-500" />;
        case "Painter":
            return <PenTool size={18} className="text-blue-500" />;
        case "Appliance Repair":
            return <LayoutGrid size={18} className="text-blue-500" />;
        case "Locksmith":
            return <Lock size={18} className="text-blue-500" />;
        case "Electrician":
        case "Handyman":
        default:
            return <Wrench size={18} className="text-blue-500" />;
    }
};

// --- Main Page Component ---
export default function Main_page() {
    const [problems, setProblems] = useState(initialProblems);
    const [search, setSearch] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

    const [form, setForm] = useState({
        title: "",
        category: "Electrician",
        location: "",
        budget: "",
        description: "",
    });

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "token") setIsLoggedIn(!!e.newValue);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const filteredProblems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return problems;
        return problems.filter((p) => {
            return (
                p.title.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        });
    }, [problems, search]);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.location.trim() || !form.description.trim()) return;

        const id = Date.now();
        const newProblem = {
            id,
            title: form.title.trim(),
            location: form.location.trim(),
            time: "just now",
            description: form.description.trim(),
            price: form.budget?.trim() ? `$${form.budget.trim()}` : "Quote",
            icon: categoryToIcon(form.category),
            category: form.category,
        };

        setProblems((prev) => [newProblem, ...prev]);
        setForm({ title: "", category: "Electrician", location: "", budget: "", description: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <header className="page-header flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button className="md:hidden">
                        <Menu size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">DevDash Repair</h1>
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
                        <SidebarItem key={cat.name} cat={cat} />
                    ))}
                </aside>

                {/* MIDDLE: Create Problem + Open Problems */}
                <section className="space-y-4 panel-problems">
                    {/* Create problem form */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Plus size={18} className="text-blue-500" />
                            <h2 className="text-lg font-bold text-gray-900">Create a Problem Request</h2>
                        </div>

                        <form onSubmit={onSubmit} className="form-grid">
                            <div className="form-field">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    value={form.title}
                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Outlet not working"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                >
                                    {categories.map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Location</label>
                                <input
                                    className="form-input"
                                    value={form.location}
                                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                                    placeholder="e.g. Skopje, MK"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Budget (USD)</label>
                                <input
                                    className="form-input"
                                    value={form.budget}
                                    onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                                    placeholder="e.g. 150"
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
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    Submit Request
                                </button>
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

                    <div className="grid gap-4">
                        {filteredProblems.map((p) => (
                            <ProblemCard key={p.id} problem={p} />
                        ))}
                    </div>
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
                            <span className="stat-value">{form.category}</span>
                        </div>
                    </div>

                    <div className="widget">
                        <p className="widget-title">Posting tips</p>
                        <ul className="tips">
                            <li>Add exact location and access info.</li>
                            <li>Include photos for faster quotes.</li>
                            <li>Write what you already tried (breaker reset, etc.).</li>
                            <li>Set a budget range to attract bids.</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
}
