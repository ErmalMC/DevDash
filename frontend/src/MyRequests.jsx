// src/MyRequests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    AlertCircle,
    User,
    MessageSquare,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Wrench
} from 'lucide-react';
import { citizenAPI } from './api/api';
// Commenting out to test if CSS file is the issue
// import './MyRequests.css';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRequestId, setExpandedRequestId] = useState(null);
    const [applications, setApplications] = useState({});

    useEffect(() => {
        loadMyRequests();
    }, []);

    const loadMyRequests = async () => {
        setLoading(true);

        try {
            console.log('🔍 Loading my requests...');

            // Try to load from API
            const data = await citizenAPI.getMyRequests();

            console.log('📦 Raw API Response:', data);
            console.log('📊 Number of requests:', data?.length);
            console.log('🔍 First request details:', data?.[0]);

            setRequests(data || []);

            // Load applications for each request
            console.log('📬 Starting to load applications for all requests...');
            for (const request of data || []) {
                console.log(`📬 Loading applications for request ${request.id}`);
                try {
                    await loadApplicationsForRequest(request.id);
                    console.log(`✅ Successfully loaded applications for request ${request.id}`);
                } catch (appError) {
                    console.error(`❌ Failed to load applications for request ${request.id}:`, appError);
                }
            }

            console.log('✅ All requests and applications loaded');
            console.log('📊 Final applications state:', applications);
        } catch (error) {
            console.error('❌ Error loading requests:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });

            // Fallback to demo mode - load from localStorage
            const demoRequests = JSON.parse(localStorage.getItem('myRepairRequests') || '[]');
            console.log('🎭 Demo mode - loaded from localStorage:', demoRequests);
            setRequests(demoRequests);

            // Load demo applications
            const demoApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');
            console.log('🎭 Demo applications from localStorage:', demoApps);
            const appsByRequest = {};

            demoRequests.forEach(request => {
                appsByRequest[request.id] = demoApps.filter(
                    app => app.repairRequest.id === request.id
                );
            });

            console.log('🎭 Organized demo applications by request:', appsByRequest);
            setApplications(appsByRequest);
        } finally {
            setLoading(false);
        }
    };

    const loadApplicationsForRequest = async (requestId) => {
        try {
            console.log(`📬 Fetching applications for request: ${requestId}`);

            // Try to load from API first
            let apps = [];
            try {
                apps = await citizenAPI.getRequestApplications(requestId);
                console.log(`✅ Got ${apps?.length || 0} applications from API for request ${requestId}`);
            } catch (apiError) {
                console.warn(`⚠️ API failed, checking localStorage:`, apiError.message);
            }

            // Also check localStorage for demo applications
            const demoApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');
            const demoAppsForRequest = demoApps.filter(
                app => app.repairRequest?.id === requestId || app.repairRequest === requestId
            );

            console.log(`🎭 Found ${demoAppsForRequest.length} demo applications in localStorage`);

            // Combine both
            const allApps = [...apps, ...demoAppsForRequest];
            console.log(`📦 Total applications (API + Demo): ${allApps.length}`);
            console.log('📦 Combined applications data:', allApps);

            setApplications(prev => {
                const updated = {
                    ...prev,
                    [requestId]: allApps
                };
                console.log('🔄 Updated applications state:', updated);
                return updated;
            });
        } catch (error) {
            console.error(`❌ Error loading applications for request ${requestId}:`, error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });

            // Fallback to just localStorage
            const demoApps = JSON.parse(localStorage.getItem('demoApplications') || '[]');
            const demoAppsForRequest = demoApps.filter(
                app => app.repairRequest?.id === requestId || app.repairRequest === requestId
            );

            setApplications(prev => ({
                ...prev,
                [requestId]: demoAppsForRequest
            }));
        }
    };

    const handleAcceptApplication = async (applicationId, requestId) => {
        if (!confirm('Accept this worker? This will assign them to your job.')) {
            return;
        }

        try {
            await citizenAPI.acceptApplication(applicationId);
            alert('Worker accepted! They will be notified.');
            await loadApplicationsForRequest(requestId);
        } catch (error) {
            console.error('Error accepting application:', error);
            alert(error.message || 'Failed to accept application');
        }
    };

    const handleDeclineApplication = async (applicationId, requestId) => {
        if (!confirm('Decline this application?')) {
            return;
        }

        try {
            await citizenAPI.declineApplication(applicationId);
            alert('Application declined.');
            await loadApplicationsForRequest(requestId);
        } catch (error) {
            console.error('Error declining application:', error);
            alert(error.message || 'Failed to decline application');
        }
    };

    const toggleRequest = (requestId) => {
        console.log('🔄 Toggling request:', requestId);
        const isCurrentlyExpanded = expandedRequestId === requestId;
        console.log('Currently expanded?', isCurrentlyExpanded);

        setExpandedRequestId(prev => {
            const newValue = prev === requestId ? null : requestId;
            console.log('New expanded ID:', newValue);
            return newValue;
        });

        // Load applications when expanding
        if (!isCurrentlyExpanded) {
            console.log('📬 Request expanded, loading applications...');
            loadApplicationsForRequest(requestId);
        }
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

    const getStatusColor = (status) => {
        const colors = {
            'OPEN': 'status-open',
            'ASSIGNED': 'status-assigned',
            'IN_PROGRESS': 'status-progress',
            'COMPLETED': 'status-completed',
            'CANCELLED': 'status-cancelled'
        };
        return colors[status] || 'status-open';
    };

    if (loading) {
        return (
            <div className="requests-page">
                <div className="loading-state">Loading your repair requests...</div>
            </div>
        );
    }

    // 🔍 DEBUG: Show what we have in state
    console.log('🎨 Rendering with requests:', requests);
    console.log('🎨 Requests length check:', requests.length, typeof requests.length);
    console.log('🎨 Is requests an array?', Array.isArray(requests));

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb'
        }}>
            {/* Header */}
            <header style={{
                background: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '24px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link to="/profile" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        fontSize: '14px',
                        marginBottom: '16px',
                        textDecoration: 'none'
                    }}>
                        <ArrowLeft size={20} />
                        Back to Profile
                    </Link>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: '0 0 8px 0'
                    }}>My Repair Requests</h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        margin: 0
                    }}>
                        {requests.length} request{requests.length !== 1 ? 's' : ''} posted
                    </p>
                </div>
            </header>

            {/* Requests List */}
            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '32px 24px'
            }}>
                {/* DEBUG: Show status */}
                <div style={{
                    background: requests.length === 0 ? '#fee2e2' : '#d1fae5',
                    color: requests.length === 0 ? '#dc2626' : '#059669',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    {requests.length === 0 ? '❌ No requests found' : `✅ Found ${requests.length} requests - Cards should appear below`}
                </div>

                {!Array.isArray(requests) ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'white',
                        borderRadius: '16px'
                    }}>
                        <h2>Error: Invalid Data</h2>
                        <p>Requests data is not an array</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Wrench size={64} style={{ color: '#d1d5db', marginBottom: '24px' }} />
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: '0 0 12px 0'
                        }}>No Repair Requests Yet</h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            margin: '0 0 32px 0'
                        }}>Post a repair request to get started</p>
                        <Link to="/" style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}>
                            Post a Request
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '20px'
                    }}>
                        {requests.map((request, index) => {
                            console.log(`🎴 Rendering card ${index + 1}:`, request.id);

                            const isExpanded = expandedRequestId === request.id;
                            const requestApps = applications[request.id] || [];
                            const pendingCount = requestApps.filter(app => app.status === 'PENDING').length;

                            console.log(`Card ${index + 1} - Expanded:`, isExpanded, 'Apps:', requestApps.length);

                            // DEBUG: Log applications state
                            if (isExpanded) {
                                console.log('🔍 EXPANDED CARD DEBUG:', {
                                    requestId: request.id,
                                    applicationsState: applications,
                                    requestApps: requestApps,
                                    requestAppsLength: requestApps.length
                                });
                            }

                            return (
                                <div
                                    key={request.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Request Header */}
                                    <div
                                        onClick={() => toggleRequest(request.id)}
                                        style={{
                                            padding: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: '20px'
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                marginBottom: '12px'
                                            }}>
                                                <h3 style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    margin: 0,
                                                    lineHeight: '1.5',
                                                    flex: 1
                                                }}>{request.description?.substring(0, 80)}</h3>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    whiteSpace: 'nowrap',
                                                    backgroundColor: '#dbeafe',
                                                    color: '#1e40af'
                                                }}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '14px',
                                                    color: '#6b7280'
                                                }}>
                                                    <MapPin size={14} />
                                                    {request.address}
                                                </span>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '14px',
                                                    color: '#6b7280'
                                                }}>
                                                    <Calendar size={14} />
                                                    {formatTimeAgo(request.createdAt)}
                                                </span>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#374151',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {getCategoryDisplayName(request.category)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Application Count Badge */}
                                        {requestApps.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '12px 16px',
                                                backgroundColor: '#f9fafb',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb'
                                            }}>
                                                <MessageSquare size={16} style={{ color: '#3b82f6' }} />
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#111827'
                                                }}>{requestApps.length} application{requestApps.length !== 1 ? 's' : ''}</span>
                                                {pendingCount > 0 && (
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: '#d97706',
                                                        backgroundColor: '#fef3c7',
                                                        padding: '2px 8px',
                                                        borderRadius: '8px'
                                                    }}>{pendingCount} pending</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded: Applications List */}
                                    {isExpanded && (
                                        <div style={{
                                            padding: '0 24px 24px 24px',
                                            borderTop: '1px solid #e5e7eb'
                                        }}>
                                            <h4 style={{
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: '#111827',
                                                margin: '20px 0 16px 0'
                                            }}>
                                                Worker Applications ({requestApps.length})
                                            </h4>

                                            {requestApps.length === 0 ? (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '20px',
                                                    backgroundColor: '#f9fafb',
                                                    borderRadius: '8px',
                                                    color: '#6b7280'
                                                }}>
                                                    <AlertCircle size={24} />
                                                    <p style={{ margin: 0 }}>No applications yet. Workers will see your request and can apply.</p>
                                                </div>
                                            ) : (
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '16px'
                                                }}>
                                                    {requestApps.map((app) => (
                                                        <div
                                                            key={app.id}
                                                            style={{
                                                                padding: '20px',
                                                                backgroundColor: '#f9fafb',
                                                                borderRadius: '12px',
                                                                border: '2px solid #e5e7eb'
                                                            }}
                                                        >
                                                            {/* Worker Info */}
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                marginBottom: '16px'
                                                            }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '12px'
                                                                }}>
                                                                    <div style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#dbeafe',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: '#3b82f6'
                                                                    }}>
                                                                        <User size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <h5 style={{
                                                                            fontSize: '16px',
                                                                            fontWeight: '600',
                                                                            color: '#111827',
                                                                            margin: '0 0 4px 0'
                                                                        }}>
                                                                            {app.worker?.fullName || 'Worker'}
                                                                        </h5>
                                                                        <span style={{
                                                                            fontSize: '12px',
                                                                            color: '#9ca3af'
                                                                        }}>
                                                                            Applied {formatTimeAgo(app.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <span style={{
                                                                    padding: '4px 12px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '12px',
                                                                    fontWeight: '600',
                                                                    textTransform: 'uppercase',
                                                                    backgroundColor: app.status === 'PENDING' ? '#fef3c7' :
                                                                        app.status === 'ACCEPTED' ? '#d1fae5' : '#fee2e2',
                                                                    color: app.status === 'PENDING' ? '#d97706' :
                                                                        app.status === 'ACCEPTED' ? '#059669' : '#dc2626'
                                                                }}>
                                                                    {app.status}
                                                                </span>
                                                            </div>

                                                            {/* Application Message */}
                                                            <div style={{
                                                                display: 'flex',
                                                                gap: '12px',
                                                                padding: '16px',
                                                                backgroundColor: 'white',
                                                                borderRadius: '8px',
                                                                marginBottom: '16px'
                                                            }}>
                                                                <MessageSquare size={16} style={{
                                                                    flexShrink: 0,
                                                                    color: '#6b7280',
                                                                    marginTop: '2px'
                                                                }} />
                                                                <p style={{
                                                                    fontSize: '14px',
                                                                    lineHeight: '1.6',
                                                                    color: '#374151',
                                                                    margin: 0
                                                                }}>{app.message}</p>
                                                            </div>

                                                            {/* Offer Details */}
                                                            {(app.proposedPrice || app.estimatedDuration) && (
                                                                <div style={{
                                                                    display: 'flex',
                                                                    gap: '20px',
                                                                    marginBottom: '16px'
                                                                }}>
                                                                    {app.proposedPrice && (
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            fontSize: '14px',
                                                                            color: '#374151',
                                                                            fontWeight: '600'
                                                                        }}>
                                                                            <DollarSign size={16} style={{ color: '#3b82f6' }} />
                                                                            <span>{app.proposedPrice} MKD</span>
                                                                        </div>
                                                                    )}
                                                                    {app.estimatedDuration && (
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            fontSize: '14px',
                                                                            color: '#374151',
                                                                            fontWeight: '600'
                                                                        }}>
                                                                            <Clock size={16} style={{ color: '#3b82f6' }} />
                                                                            <span>{app.estimatedDuration}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Actions (only for pending) */}
                                                            {app.status === 'PENDING' && (
                                                                <div style={{
                                                                    display: 'flex',
                                                                    gap: '12px',
                                                                    justifyContent: 'flex-end'
                                                                }}>
                                                                    <button
                                                                        onClick={() => handleDeclineApplication(app.id, request.id)}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            padding: '8px 16px',
                                                                            border: '1px solid #fca5a5',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            backgroundColor: 'white',
                                                                            color: '#dc2626'
                                                                        }}
                                                                    >
                                                                        <XCircle size={16} />
                                                                        Decline
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAcceptApplication(app.id, request.id)}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            padding: '8px 16px',
                                                                            border: 'none',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            backgroundColor: '#10b981',
                                                                            color: 'white'
                                                                        }}
                                                                    >
                                                                        <CheckCircle size={16} />
                                                                        Accept Worker
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Response info */}
                                                            {app.respondedAt && (
                                                                <div style={{
                                                                    textAlign: 'right',
                                                                    fontSize: '12px',
                                                                    color: '#9ca3af',
                                                                    paddingTop: '12px',
                                                                    borderTop: '1px solid #e5e7eb'
                                                                }}>
                                                                    {app.status === 'ACCEPTED' ? '✓ Accepted' : '✗ Declined'} {formatTimeAgo(app.respondedAt)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyRequests;