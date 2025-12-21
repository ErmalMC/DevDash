// src/components/WorkerApplicationModal.jsx
import React, { useState } from 'react';
import { X, DollarSign, Clock, MessageSquare } from 'lucide-react';
import './WorkerApplicationModal.css';

const WorkerApplicationModal = ({ isOpen, onClose, onSubmit, requestDetails }) => {
    const [formData, setFormData] = useState({
        message: '',
        proposedPrice: '',
        estimatedDuration: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.message.trim()) {
            alert('Please provide a message explaining your offer');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            // Show success message
            setShowSuccess(true);
            // Reset form after 2 seconds
            setTimeout(() => {
                setFormData({
                    message: '',
                    proposedPrice: '',
                    estimatedDuration: ''
                });
                setShowSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Submit Your Application</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {requestDetails && (
                    <div className="request-preview">
                        <h3 className="preview-title">Request Details</h3>
                        <p className="preview-description">{requestDetails.description}</p>
                        <div className="preview-meta">
                            <span className="preview-category">{requestDetails.category}</span>
                            <span className="preview-urgency urgency-{requestDetails.urgency?.toLowerCase()}">
                                {requestDetails.urgency}
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="application-form">
                    {showSuccess && (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Application Submitted!</h3>
                            <p>The citizen will review your offer and contact you soon.</p>
                        </div>
                    )}

                    {!showSuccess && (
                        <>
                            <div className="form-group">
                        <label className="form-label">
                            <MessageSquare size={16} />
                            Your Message *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Explain why you're the right person for this job, your experience, and how you'll approach the repair..."
                            rows={5}
                            required
                            className="form-textarea"
                        />
                        <span className="form-hint">
                            Tip: Mention relevant experience and your availability
                        </span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <DollarSign size={16} />
                                Proposed Price (MKD)
                            </label>
                            <input
                                type="number"
                                name="proposedPrice"
                                value={formData.proposedPrice}
                                onChange={handleChange}
                                placeholder="e.g., 2500"
                                min="0"
                                step="50"
                                className="form-input"
                            />
                            <span className="form-hint">Optional - Leave empty if you need to assess first</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Clock size={16} />
                                Estimated Duration
                            </label>
                            <input
                                type="text"
                                name="estimatedDuration"
                                value={formData.estimatedDuration}
                                onChange={handleChange}
                                placeholder="e.g., 2-3 hours"
                                className="form-input"
                            />
                            <span className="form-hint">Optional - How long will the job take?</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default WorkerApplicationModal;