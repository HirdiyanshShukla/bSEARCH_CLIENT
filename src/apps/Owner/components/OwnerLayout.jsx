import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/context/AuthContext';

export default function OwnerLayout({ children, title, showNav = true }) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="owner-container">
            <div className="auth-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {showNav && (
                <nav className="owner-nav">
                    <div className="nav-content">
                        <h1 className="nav-logo">
                            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Business Owner Portal
                        </h1>

                        <button onClick={handleLogout} className="btn btn-outline">
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                        <button className='btn btn-outline' onClick={()=>navigate("/")}>
                            go to user homepage
                        </button>
                    </div>
                </nav>
            )}

            <div className="owner-content">
                {title && <h1 className="owner-page-title">{title}</h1>}
                {children}
            </div>
        </div>
    );
}
