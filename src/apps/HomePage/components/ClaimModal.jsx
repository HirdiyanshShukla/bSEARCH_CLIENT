import { useState } from 'react';
import businessService from '../services/businessService';

export default function ClaimModal({ business, onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Update Info
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [businessEmail, setBusinessEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [businessInfo, setBusinessInfo] = useState({
        description: business.description || '',
        phone: business.phone || '',
        website: business.website || '',
        hours: business.hours || '',
    });

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await businessService.claimBusiness(business.placeId, businessEmail);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send claim request');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await businessService.verifyClaim(business.placeId, otp);
            setStep(3);
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await businessService.updateBusiness(business.placeId, businessInfo);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update business information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content claim-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Claim {business.name}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify OTP</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Update Info</span>
                    </div>
                </div>

                {error && (
                    <div className="message message-error">{error}</div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="modal-form">
                        <p className="modal-description">
                            Enter your business email address. We'll send a verification code to confirm ownership.
                        </p>
                        <div className="input-group">
                            <label htmlFor="businessEmail" className="input-label">Business Email</label>
                            <input
                                id="businessEmail"
                                type="email"
                                value={businessEmail}
                                onChange={(e) => setBusinessEmail(e.target.value)}
                                placeholder="owner@company.com"
                                className="input-field"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                'Send Verification Code'
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOTPSubmit} className="modal-form">
                        <p className="modal-description">
                            Enter the 6-digit verification code sent to {businessEmail}
                        </p>
                        <div className="input-group">
                            <label htmlFor="otp" className="input-label">Verification Code</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                className="input-field otp-input"
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                        <button type="button" className="btn-text" onClick={() => setStep(1)}>
                            Change Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleInfoSubmit} className="modal-form">
                        <p className="modal-description">
                            Update your business information to help customers find you.
                        </p>
                        <div className="input-group">
                            <label htmlFor="description" className="input-label">Description</label>
                            <textarea
                                id="description"
                                value={businessInfo.description}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                                placeholder="Tell customers about your business..."
                                className="input-field textarea-field"
                                rows="3"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="phone" className="input-label">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                value={businessInfo.phone}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                                placeholder="+91 1234567890"
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="website" className="input-label">Website</label>
                            <input
                                id="website"
                                type="url"
                                value={businessInfo.website}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                                placeholder="https://yourwebsite.com"
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="hours" className="input-label">Business Hours</label>
                            <input
                                id="hours"
                                type="text"
                                value={businessInfo.hours}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, hours: e.target.value })}
                                placeholder="10 AM - 11 PM"
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                'Complete Claim'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
