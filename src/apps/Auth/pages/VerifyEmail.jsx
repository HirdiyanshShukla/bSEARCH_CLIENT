import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authService from '../services/authService';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Get email from navigation state
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect to signup
            navigate('/signup');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authService.verifyEmail(email, otp);
            setMessage({
                type: 'success',
                text: 'Email verified successfully!'
            });

            // Navigate to login page after verification
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Verification failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle={`We sent a code to ${email}`}
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="Enter OTP"
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                />

                {message.text && (
                    <div className={`message message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" loading={loading}>
                    Verify Email
                </Button>

                <p className="auth-footer-text">
                    Didn't receive the code?{' '}
                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => setMessage({ type: 'info', text: 'Resend functionality coming soon!' })}
                    >
                        Resend
                    </button>
                </p>

                <p className="auth-footer-text">
                    <Link to="/signup" className="auth-link">
                        Back to Sign Up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
