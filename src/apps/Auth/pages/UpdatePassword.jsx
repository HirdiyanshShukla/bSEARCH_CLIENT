import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authService from '../services/authService';

export default function UpdatePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [resetToken, setResetToken] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Get reset token from navigation state
        if (location.state?.resetToken) {
            setResetToken(location.state.resetToken);
        } else {
            // If no token in state, redirect to forgot password
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authService.updatePassword(resetToken, formData.newPassword);
            setMessage({
                type: 'success',
                text: 'Password updated successfully!'
            });

            // Navigate to login page
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create New Password"
            subtitle="Enter your new password"
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    error={errors.newPassword}
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    error={errors.confirmPassword}
                    required
                />

                {message.text && (
                    <div className={`message message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" loading={loading}>
                    Update Password
                </Button>

                <p className="auth-footer-text">
                    <Link to="/login" className="auth-link">
                        Back to Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
