// ClientDetailsForJob.jsx
import React from "react";
import "./HandymanJobDetails.css"; // reuse the same CSS file

const ClientDetailsForJob = () => {
    return (
        <div className="page">
            {/* Top bar – unchanged */}
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="logo-block">
                        <div className="logo-circle">HC</div>
                        <span className="logo-text">HandyConnect</span>
                    </div>

                    <div className="topbar-search-wrapper">
                        <input
                            className="topbar-search"
                            placeholder="Search jobs, clients, or skills..."
                        />
                    </div>
                </div>
            </header>

            <main className="layout">
                {/* LEFT COLUMN */}
                <div className="left-column">
                    {/* Back + Title + meta (same as before) */}
                    <section className="section section-header">
                        <div className="header-row">
                            <button
                                className="back-button"
                                onClick={() => {
                                    if (window.history.length > 1) window.history.back();
                                    else window.location.href = "/";
                                }}
                            >
                                <span className="back-arrow">←</span>
                                <span>Back to candidates</span>
                            </button>
                            <h1 className="job-title">Plumbing Fix for Leaky Faucet</h1>
                        </div>

                        <div className="job-meta-row">
                            <span className="pill pill-tag">Plumbing</span>

                            <span className="job-client">
                <span className="avatar" />
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

                    {/* Rate + schedule – unchanged */}
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

                    {/* Description – unchanged */}
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

                    {/* Attachments – unchanged */}
                    <section className="section">
                        <h2 className="section-title">Attachments</h2>
                        <div className="attachments-grid">
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                            <div className="attachment-box" />
                        </div>
                    </section>

                    {/* Skills – unchanged */}
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

                    {/* Handyman summary for THIS candidate */}
                    <section className="section">
                        <h2 className="section-title">Selected Handyman</h2>
                        <div className="selected-handyman-row">
                            <div className="selected-handyman-main">
                                <div className="avatar-large" />
                                <div>
                                    <div className="selected-handyman-name">Mike&apos;s Plumbing</div>
                                    <div className="selected-handyman-meta">
                                        ⭐ 4.9 · 120 jobs completed · Member since 2020
                                    </div>
                                </div>
                            </div>
                            <button className="link-button">View full profile</button>
                        </div>
                    </section>

                    {/* Ratings / reviews / distance (client-focused stats) */}
                    <section className="section score-row">
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">4.9</div>
                            <div className="score-label">Average Rating</div>
                        </div>
                        <div className="score-block score-block-border">
                            <div className="score-icon" />
                            <div className="score-value">120</div>
                            <div className="score-label">Completed Jobs</div>
                        </div>
                        <div className="score-block">
                            <div className="score-icon" />
                            <div className="score-value">15 min</div>
                            <div className="score-label">Travel Estimate</div>
                        </div>
                    </section>

                    {/* Your decision – client chooses handyman */}
                    <section className="section">
                        <h2 className="section-title">Your Decision</h2>
                        <p className="body-text">
                            Review this handyman&apos;s details, chat history, and ratings
                            before deciding whether to hire them for this job.
                        </p>
                        <div className="action-buttons">
                            <button className="btn-primary">Accept Handyman</button>
                            <button className="btn-outline">Decline</button>
                            <span className="ask-question-label">Ask Another Question</span>
                        </div>
                        <div className="action-meta">
                            <span>Est. Payout: $237.50</span>
                            <span>Job Window: 10:00 AM – 12:00 PM</span>
                            <span>Free cancellation up to 24 hours before</span>
                        </div>
                    </section>

                    {/* Other applicants (for context) */}
                    <section className="section">
                        <h2 className="section-title">Other Handyman Applications</h2>
                        <ul className="activity-list">
                            <li>Sarah P. — 4.8 ⭐ — 80 jobs completed</li>
                            <li>QuickFix Solutions — 4.7 ⭐ — 65 jobs completed</li>
                            <li>2 more applications pending review</li>
                        </ul>
                        <p className="activity-footer">
                            You can accept only one handyman. Others will be automatically
                            declined once you confirm.
                        </p>
                    </section>

                    {/* Safety & payment & tips – same copy but from client POV */}
                    <section className="section">
                        <h2 className="section-title">Safety &amp; Payment Protection</h2>
                        <div className="safety-row">
                            <span>🔒 Secure payments held in escrow</span>
                            <span>✔ Handyman identity verified</span>
                            <button className="link-danger">Report this profile</button>
                        </div>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Tips for Deciding</h2>
                        {[
                            "Compare handyman ratings & completed jobs",
                            "Check response time and communication in chat",
                            "Confirm availability and travel estimates",
                            "Review attachments and requested scope",
                        ].map((t) => (
                            <div key={t} className="tip-row">
                                {t}
                            </div>
                        ))}
                    </section>

                    {/* Bottom bar – accept handyman */}
                    <div className="bottom-bar">
                        <button className="btn-primary">Accept Handyman</button>
                        <span className="made-with">
              <span className="made-with-dot" />
              Made with Visily
            </span>
                    </div>
                </div>

                {/* RIGHT COLUMN – chat stays the same */}
                <aside className="right-column">
                    <div className="chat-card">
                        <div className="chat-header">
                            <div>
                                <h2 className="chat-title">Ask Mike&apos;s Plumbing a Question</h2>
                                <p className="chat-subtitle">
                                    Clarify any details before you confirm the booking.
                                </p>
                            </div>
                            <button className="chat-close">×</button>
                        </div>

                        <div className="chat-body">
                            <div className="bubble bubble-left">
                                Hi Mike, can you confirm you&apos;re available for Oct 26, between
                                10:00 AM and 12:00 PM?
                            </div>
                            <div className="bubble-row-right">
                                <div className="bubble bubble-right">
                                    Yes, that time works for me. I can also arrive a bit earlier if
                                    needed.
                                </div>
                            </div>
                            <div className="bubble bubble-left">
                                Great, do you need me to provide any parts in advance?
                            </div>
                        </div>

                        <div className="chat-input-row">
              <textarea
                  className="chat-input chat-input--textarea"
                  placeholder="Type your message..."
                  rows={1}
                  onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
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

export default ClientDetailsForJob;
