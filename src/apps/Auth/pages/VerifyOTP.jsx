import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authService from '../services/authService';

export default function VerifyOTP() {
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
            // If no email in state, redirect to forgot password
            navigate('/forgot-password');
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
            const response = await authService.verifyOTP(email, otp);
            setMessage({
                type: 'success',
                text: 'OTP verified! Redirecting...'
            });

            // Navigate to update password with reset token
            setTimeout(() => {
                navigate('/update-password', {
                    state: { resetToken: response.data.resetToken }
                });
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Invalid OTP. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Verify OTP"
            subtitle={`Enter the code sent to ${email}`}
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
                    Verify OTP
                </Button>

                <p className="auth-footer-text">
                    Didn't receive the code?{' '}
                    <Link to="/forgot-password" className="auth-link">
                        Resend
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
