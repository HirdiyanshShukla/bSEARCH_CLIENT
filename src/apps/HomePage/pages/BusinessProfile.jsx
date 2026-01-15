import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/context/AuthContext';
import ClaimModal from '../components/ClaimModal';
import businessService from '../services/businessService';
import ownerService from '../../Owner/services/ownerService';


export default function BusinessProfile() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [business, setBusiness] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState('');
    const [showClaimModal, setShowClaimModal] = useState(false);

    useEffect(() => {
        loadBusinessProfile();
    }, [placeId]);

    const loadBusinessProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await businessService.getBusinessProfile(placeId);
            setBusiness(response.data);

            // Load items if business is claimed
            if (response.data?.claimed) {
                loadItems();
            }
        } catch (err) {
            setError(err.message || 'Failed to load business profile');
        } finally {
            setLoading(false);
        }
    };

    const loadItems = async () => {
        try {
            setLoadingItems(true);
            const response = await ownerService.getItems(placeId);
            setItems(response.data.data || []);
        } catch (err) {
            console.error('Failed to load items:', err);
            setItems([]);
        } finally {
            setLoadingItems(false);
        }
    };

    // const handleDirections = (e) => {
    //     if (!business) return;


    //     let destination = '';

    //     if (business.location?.lat && business.location?.lng) {
    //         destination = `${business.location.lat},${business.location.lng}`;
    //     } else if (business.address) {
    //         destination = business.address;
    //     } else {
    //         alert('Location not available for this business');
    //         return;
    //     }

    //     const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

    //     window.open(url, '_blank');
    // };


    const handleClaimSuccess = () => {
        setShowClaimModal(false);
        loadBusinessProfile(); // Reload to show updated claim status
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p className="loading-text">Loading business profile...</p>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="profile-container">
                <div className="message message-error">{error || 'Business not found'}</div>
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                    Back to Search
                </button>
            </div>
        );
    }

    const isOwner = user?.role === 'owner';
    const showClaimButton = isOwner && !business.claimed;

    return (
        <div className="profile-container">
            <button onClick={() => navigate('/')} className="btn btn-back">
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Search
            </button>
            {user?.role === "owner" && (
                <button
                    onClick={() => navigate("/owner")}
                    className="btn btn-outline"
                >
                    Owner Dashboard
                </button>
                )}


            <div className="profile-card">
                <div className="profile-header">
                    <div>
                        <h1 className="profile-title">{business.name}</h1>
                        <p className="profile-category">{business.category}</p>
                    </div>
                    {business.claimed ? (
                        <span className="verified-badge verified-badge-large">
                            <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified Business
                        </span>
                    ) : (
                        <span className="unverified-badge unverified-badge-large">Unverified</span>
                    )}
                </div>

                {business.description && (
                    <div className="profile-section">
                        <h2 className="section-title">About</h2>
                        <p className="profile-description">{business.description}</p>
                    </div>
                )}

                <div className="profile-section">
                    <h2 className="section-title">Contact Information</h2>
                    <div className="profile-info-grid">
                        <div className="info-item">
                            <div className="info-item-label">
                                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Address
                            </div>
                            <div className="info-item-value">{business.address}</div>
                        </div>

                        {business.claimed && (
                            <>
                                {business.phone && (
                                    <div className="info-item">
                                        <div className="info-item-label">
                                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Phone
                                        </div>
                                        <div className="info-item-value">{business.phone}</div>
                                    </div>
                                )}

                                {business.website && (
                                    <div className="info-item">
                                        <div className="info-item-label">
                                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            Website
                                        </div>
                                        <div className="info-item-value">
                                            <a
                                                href={business.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="website-link"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {business.hours && (
                                    <div className="info-item">
                                        <div className="info-item-label">
                                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Hours
                                        </div>
                                        <div className="info-item-value">{business.hours}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {business.location && (
                    <div className="profile-section">
                        <h2 className="section-title">Location</h2>
                        <p className="location-coords">
                            Latitude: {business.location.lat}, Longitude: {business.location.lng}
                        </p>
                    </div>
                )}

                {/* Items Section */}
                {business.claimed && (
                    <div className="profile-section">
                        <h2 className="section-title">Menu / Items</h2>
                        {loadingItems ? (
                            <div className="owner-loading-state">
                                <div className="spinner-large"></div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="owner-empty-state">
                                <p className="owner-empty-text">No items available</p>
                            </div>
                        ) : (
                            <div className="items-display-grid">
                                {items.map((item) => (
                                    <div key={item._id} className="item-display-card">
                                        <div className="item-display-header">
                                            <h4 className="item-display-name">{item.name}</h4>
                                            <span className="item-display-price">₹{item.price}</span>
                                        </div>
                                        {item.description && (
                                            <p className="item-display-description">{item.description}</p>
                                        )}
                                        <div className="item-display-availability">
                                            {item.available ? (
                                                <span className="availability-badge available">
                                                    <svg className="badge-icon-small" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="availability-badge unavailable">
                                                    <svg className="badge-icon-small" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Currently Unavailable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                <div className="profile-actions">

                    {showClaimButton && (
                        <button className="btn btn-accent" onClick={() => setShowClaimModal(true)}>
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Claim This Business
                        </button>
                    )}
                </div>
            </div>

            {showClaimModal && (
                <ClaimModal
                    business={business}
                    onClose={() => setShowClaimModal(false)}
                    onSuccess={handleClaimSuccess}
                />
            )}
        </div>
    );
}
