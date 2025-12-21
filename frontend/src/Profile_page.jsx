import React, {useState, useEffect} from 'react';
import {
    Search,
    MapPin,
    Star,
    ShieldCheck,
    CheckCircle2,
    HardHat,
    FileText,
    Lock,
    User,
    Briefcase,
    MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Mock Data ---
const profileData = {
    name: 'John Doe',
    title: 'Master Electrician',
    rate: 75,
    rating: 4.8,
    reviews: 125,
    location: '20-mile radius',
    about:
        'With over 15 years of experience in the electrical trade, John Doe is a highly skilled and licensed master electrician dedicated to providing top-quality residential and commercial electrical solutions. Known for his precision, safety-conscious approach, and problem-solving abilities, he handles everything from complex rewiring projects to routine maintenance with the same level of professionalism.',
};

const services = [
    { title: 'Electrical Wiring & Rewiring', desc: 'Safe and efficient wiring solutions for new constructions or upgrades.', price: '$150 - $500' },
    { title: 'Fixture Installation', desc: 'Installation of lighting fixtures, ceiling fans, and other electrical appliances.', price: '$75 - $200' },
    { title: 'Circuit Breaker Repair', desc: 'Diagnosing and repairing faulty circuit breakers and panels.', price: '$100 - $300' },
    { title: 'Outlet & Switch Replacement', desc: 'Upgrading or repairing electrical outlets and switches.', price: '$50 - $120' },
    { title: 'Emergency Electrical Service', desc: '24/7 rapid response for urgent electrical issues.', price: '$100/hr + call-out fee' },
    { title: 'Smart Home System Integration', desc: 'Setting up and integrating smart home devices and electrical systems.', price: '$200 - $800' },
];

const pricingItems = [
    { label: 'Diagnostic Fee', value: '$60' },
    { label: 'Minor Repair', value: '$75 - $150' },
    { label: 'Major Installation', value: 'Quote based' },
];

const serviceRequests = [
    {
        id: 101,
        title: 'Outlet not working in bedroom',
        location: 'New York, NY',
        budget: '$150',
        status: 'Open',
        posted: '2 hours ago',
        description: 'One outlet stopped working; breaker reset did not help.',
    },
    {
        id: 102,
        title: 'Ceiling fan installation',
        location: 'Brooklyn, NY',
        budget: '$120',
        status: 'Pending',
        posted: '1 day ago',
        description: 'Install ceiling fan in living room; wiring exists.',
    },
];


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
            {/* Navigation links commented out - can be re-enabled */}
        </div>
    </header>
);

const Badge = ({type, text}) => {
    const Icon = type === 'verified' ? ShieldCheck : CheckCircle2;
    const cls = type === 'verified' ? 'badge badge--verified' : 'badge badge--insured';
    return (
        <span className={cls}>
            <Icon size={14}/>
            {text}
        </span>
    );
};

const RequestedServiceCard = ({req}) => (
    <div className="card request-card">
        <div className="request-top">
            <div>
                <h4 className="service-title">{req.title}</h4>
                <p className="muted request-meta">
                    {req.location} • {req.posted} • Status: {req.status}
                </p>
            </div>

            <div className="request-right">
                <span className="service-price">{req.budget}</span>
                <Link to={`/dclient/${req.id}`} className="btn btn--ghost btn--sm">
                    View details
                </Link>
            </div>
        </div>

        <p className="muted service-desc">{req.description}</p>
    </div>
);

const ServiceCard = ({ service }) => (
    <div className="card service-card">
        <div className="service-row">
            <input type="checkbox" className="check" />
            <div className="service-body">
                <div
                    className="service-top"
                    style={{ alignItems: "flex-end", display: "flex", justifyContent: "space-between" }}
                >
                    <h4 className="service-title">{service.title}</h4>
                    <span className="service-price">{service.price}</span>
                </div>
                <p className="muted service-desc">{service.desc}</p>
            </div>
        </div>
    </div>
);


export default function Profile_page() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [applicationCount, setApplicationCount] = useState(0);
    const [requestCount, setRequestCount] = useState(0);

    // Load application and request counts on mount
    useEffect(() => {
        const demoApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');
        setApplicationCount(demoApps.length);

        const myRequests = JSON.parse(localStorage.getItem('myRepairRequests') || '[]');
        setRequestCount(myRequests.length);
    }, []);

    return (
        <div className="page">
            <Header />

            <main className="container profile-grid">
                {/* LEFT */}
                <section className="col col--left">
                    <div className="card profile-card">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe123"
                            alt="Profile"
                            className="profile-avatar"
                        />
                        <h2 className="h2">{profileData.name}</h2>
                        <p className="muted">{profileData.title}</p>

                        <div className="badge-row">
                            <Badge type="verified" text="Verified" />
                            <Badge type="insured" text="Insured" />
                        </div>

                        <div className="rating">
                            <Star size={16} className="rating-star" />
                            <span className="rating-score">{profileData.rating}</span>
                            <span className="muted">({profileData.reviews} Reviews)</span>
                        </div>

                        <div className="rate">${profileData.rate}/hr</div>

                        <div className="location muted">
                            <MapPin size={14} />
                            <span>{profileData.location}</span>
                        </div>

                        {/* NEW: View Applications Button */}
                        <Link
                            to="/my-applications"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                marginTop: '16px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'background-color 0.2s',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            <Briefcase size={18} />
                            My Applications
                            {applicationCount > 0 && (
                                <span style={{
                                    backgroundColor: 'white',
                                    color: '#3b82f6',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    marginLeft: '4px'
                                }}>
                                    {applicationCount}
                                </span>
                            )}
                        </Link>

                        {/* NEW: View My Requests Button */}
                        <Link
                            to="/my-requests"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                marginTop: '12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'background-color 0.2s',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                        >
                            <MessageSquare size={18} />
                            My Requests
                            {requestCount > 0 && (
                                <span style={{
                                    backgroundColor: 'white',
                                    color: '#10b981',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    marginLeft: '4px'
                                }}>
                                    {requestCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="card">
                        <h3 className="h3">Trust &amp; Security</h3>
                        <ul className="trust-list">
                            <li><ShieldCheck size={18} /> Background Checked &amp; Vetted</li>
                            <li><FileText size={18} /> Licensed &amp; Certified Professional</li>
                            <li><HardHat size={18} /> Customer Satisfaction Guarantee</li>
                            <li><Lock size={18} /> Transparent Pricing &amp; No Hidden Fees</li>
                        </ul>
                    </div>
                </section>

                {/* MIDDLE (Requested -> Offered -> About) */}
                <section className="col col--mid">
                    {/* Services Requested (moved here) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 className="h2">Services Requested</h2>
                            {applicationCount > 0 && (
                                <Link
                                    to="/my-applications"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: '#3b82f6',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        fontWeight: '600'
                                    }}
                                >
                                    <MessageSquare size={16} />
                                    View {applicationCount} application{applicationCount !== 1 ? 's' : ''}
                                </Link>
                            )}
                        </div>
                        <div className="stack">
                            {serviceRequests.map((r) => (
                                <RequestedServiceCard key={r.id} req={r} />
                            ))}
                        </div>
                    </div>

                    {/* Services Offered (now under Requested) */}
                    <div className="card">
                        <h2 className="h2">Services Offered</h2>
                        <div className="stack">
                            {services.map((s) => (
                                <ServiceCard key={s.title} service={s} />
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="h2">About {profileData.name}</h2>
                        <p className="muted about">{profileData.about}</p>
                    </div>
                </section>

                {/* RIGHT */}
                <section className="col col--right">
                    <div className="card">
                        <h3 className="h3">Pricing Breakdown</h3>

                        <div className="pricing-head">
                            <span>Service</span>
                            <span>Est. Cost</span>
                        </div>

                        <div className="pricing-list">
                            {pricingItems.map((it) => (
                                <div className="pricing-row" key={it.label}>
                                    <span>{it.label}</span>
                                    <span className="pricing-val">{it.value}</span>
                                </div>
                            ))}

                            <div className="pricing-highlight">
                                <span>Hourly Rate</span>
                                <span>${profileData.rate}</span>
                            </div>
                        </div>

                        <p className="tiny muted">
                            *All prices are estimates and may vary based on complexity.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}