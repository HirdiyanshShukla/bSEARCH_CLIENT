import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const me = await login(formData.email, formData.password);

            setMessage({
                type: 'success',
                text: 'Login successful! Redirecting...'
            });

            setTimeout(() => {
                if (me?.role === "owner") {
                    navigate("/owner");
                } else {
                    navigate("/");
                }
            }, 500);

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Login failed. Please check your credentials.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Log in to your account">
            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                />

                {message.text && (
                    <div className={`message message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end mb-4">
                    <Link to="/forgot-password" className="auth-link text-sm">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" loading={loading}>
                    Log In
                </Button>

                <p className="auth-footer-text">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}