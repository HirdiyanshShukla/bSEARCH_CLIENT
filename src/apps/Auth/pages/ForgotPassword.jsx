import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authService from '../services/authService';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Email is required' });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authService.forgotPassword(email);
            setMessage({
                type: 'success',
                text: 'Password reset code sent to your email!'
            });

            // Navigate to OTP verification page
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to send reset code. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email to receive a reset code"
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />

                {message.text && (
                    <div className={`message message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" loading={loading}>
                    Send Reset Code
                </Button>

                <p className="auth-footer-text">
                    Remember your password?{' '}
                    <Link to="/login" className="auth-link">
                        Log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
