// HandymanJobDetails.jsx
import React, {useState} from "react";
import "./HandymanJobDetails.css";
import {Link, useNavigate} from "react-router-dom";
import {HardHat, User} from "lucide-react";

const HandymanJobDetails = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

    const handleBack = () => {
        // simple default behavior
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // fallback – you can change this to navigate to your jobs list route
            window.location.href = "/main.jsx";
        }
    };

    return (
        <div className="page">
            {/* Top bar */}
            <header className="topbar">
                {/* Left */}
                <div className="logo-block">
                    <Link to="/" className="brand-badge">
                        <HardHat size={18} />
                    </Link>
                    <span className="brand-name">HandyConnect</span>
                </div>

                {/* Center */}
                <div className="topbar-search-wrapper">
                    <input
                        className="topbar-search"
                        placeholder="Search jobs, clients, or skills..."
                    />
                </div>

                {/* Right */}
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
                            <h1 className="job-title">Plumbing Fix for Leaky Faucet</h1>
                        </div>

                        <div className="job-meta-row">
                            <span className="pill pill-tag">Plumbing</span>

                            <span className="job-client">
                <span className="avatar"/>
                <span className="job-client-name">Alice Smith</span>
              </span>

                            <span className="pill pill-verified">Verified Client</span>

                            <span className="dot">•</span>
                            <span className="job-meta-text">Posted 3 hours ago</span>
                        </div>

                        <p className="job-status">
                            Status: <span className="job-status-open">Open</span>
                        </p>
                    </section>

                    {/* ...rest of your sections remain exactly the same... */}
                    {/* Rate + schedule */}
                    <section className="section section-row">
                        <div className="rate-block">
                            <div className="rate-amount">$250</div>
                            <div className="rate-label">Fixed Rate</div>
                        </div>
                        <div className="rate-details">
                            <div className="rate-line">
                                <span className="icon-dot" />
                                123 Main St, Anytown, CA
                            </div>
                            <div className="rate-line">
                                <span className="icon-dot" />
                                Oct 26, 2023, 10:00 AM – 12:00 PM
                            </div>
                            <div className="rate-line">
                                <span className="icon-dot" />
                                One-time Project
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section className="section">
                        <h2 className="section-title">Job Description</h2>
                        <p className="body-text">
                            My kitchen faucet has been leaking steadily for the past few days,
                            and it&apos;s getting worse. I&apos;ve tried tightening it, but it
                            doesn&apos;t seem to stop. I need an experienced handyman to
                            diagnose the issue and fix it properly.
                        </p>
                        <p className="body-text">
                            The faucet is a standard single-handle chrome faucet. I&apos;m
                            looking for someone who can come as soon as possible and ensure
                            the leak is fully resolved.
                        </p>
                    </section>

                    {/* Attachments */}
                    <section className="section">
                        <h2 className="section-title">Attachments</h2>
                        <div className="attachments-grid">
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="section">
                        <h2 className="section-title">Required Skills &amp; Tools</h2>
                        <div className="tags-row">
                            {[
                                "Plumbing",
                                "Leak Repair",
                                "Faucet Installation",
                                "Pipe Fitting",
                                "Customer Service",
                                "Basic Tools (Wrenches, Pliers, Sealant)",
                            ].map((t) => (
                                <span key={t} className="pill pill-chip">
                  {t}
                </span>
                            ))}
                        </div>
                    </section>

                    {/* Score / reviews / viewing */}
                    <section className="section score-row">
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">4.9</div>
                            <div className="score-label">Client Score</div>
                        </div>
                        <div className="score-block score-block-border">
                            <div className="score-icon" />
                            <div className="score-value">50+</div>
                            <div className="score-label">Reviews</div>
                        </div>
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">8/10</div>
                            <div className="score-label">Handymen Viewing</div>
                        </div>
                    </section>

                    {/* Your action */}
                    <section className="section">
                        <h2 className="section-title">Your Action</h2>
                        <div className="action-buttons">
                            <button className="btn-primary">Accept Job</button>
                            <button className="btn-outline">Decline</button>
                            <span className="ask-question-label">Ask Question</span>
                        </div>
                        <div className="action-meta">
                            <span>Est. Payout: $237.50</span>
                            <span>Travel Est: 15 mins</span>
                            <span>Time Est: 2 hours</span>
                        </div>
                    </section>

                    {/* Other handymen */}
                    <section className="section">
                        <h2 className="section-title">Other Handymen Activity</h2>
                        <ul className="activity-list">
                            <li>John D. — Accepted</li>
                            <li>Sarah P. — Accepted</li>
                            <li>5 other handymen viewing</li>
                        </ul>
                        <p className="activity-footer">
                            3 Handymen Accepted, 2 Slots Remaining.
                        </p>
                    </section>

                    {/* Availability */}
                    <section className="section">
                        <h2 className="section-title">Your Availability</h2>
                        <div className="availability-box">
                            <div className="availability-icon">📅</div>
                            <p>Preview your calendar and block time for this job.</p>
                        </div>
                        <button className="btn-block-time">Block Time for this Job</button>
                    </section>

                    {/* Safety */}
                    <section className="section">
                        <h2 className="section-title">Safety &amp; Payment Protection</h2>
                        <div className="safety-row">
                            <span>🔒 Secured Payments</span>
                            <span>✔ Client Identity Verified</span>
                            <button className="link-danger">Report Job</button>
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="section">
                        <h2 className="section-title">Tips for Deciding</h2>
                        {[
                            "Review Client History & Ratings",
                            "Clarify Scope of Work",
                            "Consider Travel & Time Estimates",
                            "Assess Your Availability",
                        ].map((t) => (
                            <div key={t} className="tip-row">
                                {t}
                            </div>
                        ))}
                    </section>

                    {/* Bottom bar */}
                    <div className="bottom-bar">
                        <button className="btn-primary">Accept Job</button>
                        <span className="made-with">
              <span className="made-with-dot" />
              Made with Visily
            </span>
                    </div>
                </div>

                {/* RIGHT COLUMN – chat */}
                <aside className="right-column">
                    <div className="chat-card">
                        <div className="chat-header">
                            <div>
                                <h2 className="chat-title">Ask Alice Smith a Question</h2>
                                <p className="chat-subtitle">
                                    Clarify job details before accepting.
                                </p>
                            </div>
                            <button className="chat-close">×</button>
                        </div>

                        <div className="chat-body">
                            <div className="bubble bubble-left">
                                Hi Alice, could you specify the brand of the faucet?
                            </div>
                            <div className="bubble-row-right">
                                <div className="bubble bubble-right">
                                    It&apos;s a Delta faucet, about 5 years old.
                                </div>
                            </div>
                            <div className="bubble bubble-left">
                                Understood. Is there any existing shut-off valve under the sink?
                            </div>
                        </div>

                        <div className="chat-input-row">
                              <textarea
                                  className="chat-input chat-input--textarea"
                                  placeholder="Type your message..."
                                  rows={1}
                                  onInput={(e) => {
                                      e.target.style.height = "auto";              // reset
                                      e.target.style.height = `${e.target.scrollHeight}px`; // grow to content
                                  }}
                              />
                              <button className="chat-send">➤</button>
                        </div>

                    </div>
                </aside>
            </main>
        </div>
    );
};

export default HandymanJobDetails;
