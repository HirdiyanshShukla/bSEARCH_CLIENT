import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/context/AuthContext';

export default function BusinessCard({ business, onClaim }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCardClick = (e) => {
        // Don't navigate if clicking on a button
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        if (!business.claimed) {
            alert("No more data available for unverified businesses");
            return;
    }

        navigate(`/business/${business.placeId}`);
    };

const handleDirections = (e) => {
    e.stopPropagation();

    let destination = '';

    if (business.location?.lat && business.location?.lng) {
        destination = `${business.location.lat},${business.location.lng}`;
    } else if (business.address) {
        destination = business.address;
    } else {
        alert('Location not available for this business222');
        return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
};


    const handleClaim = (e) => {
        e.stopPropagation();
        onClaim(business);
    };

    const isOwner = user?.role === 'owner';
    const showClaimButton = isOwner && !business.claimed;

    return (
        <div className="business-card" onClick={handleCardClick}>
            <div className="business-card-header">
                <h3 className="business-name">{business.name}</h3>
                {business.claimed ? (
                    <span className="verified-badge">
                        <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Business
                    </span>
                ) : (
                    <span className="unverified-badge">Unverified</span>
                )}
            </div>

            <div className="business-info">
                <div className="info-row">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{business.address}</span>
                </div>

                <div className="info-row">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="category-tag">{business.category}</span>
                </div>

                {business.claimed && (
                    <>
                        {business.phone && (
                            <div className="info-row">
                                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{business.phone}</span>
                            </div>
                        )}

                        {business.website && (
                            <div className="info-row">
                                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <a
                                    href={business.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="website-link"
                                >
                                    Visit Website
                                </a>
                            </div>
                        )}

                        {business.hours && (
                            <div className="info-row">
                                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{business.hours}</span>
                            </div>
                        )}
                    </>
                )}

                {business.description && (
                    <p className="business-description">{business.description}</p>
                )}
            </div>

            <div className="business-actions">
                <button className="btn btn-secondary" onClick={handleDirections}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Directions
                </button>

                {showClaimButton && (
                    <button className="btn btn-accent" onClick={handleClaim}>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Claim Business
                    </button>
                )}
            </div>
        </div>
    );
}
