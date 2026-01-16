export default function OfferDisplay({ offer }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isExpired = new Date(offer.validTill) < new Date();

    return (
        <div className={`offer-card ${isExpired ? 'expired' : ''}`}>
            <div className="offer-header">
                <div className="offer-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                    </svg>
                </div>
                <h4 className="offer-title">{offer.title}</h4>
            </div>
            <p className="offer-description">{offer.description}</p>
            <div className="offer-footer">
                <span className={`offer-validity ${isExpired ? 'expired' : ''}`}>
                    {isExpired ? (
                        <>Expired on {formatDate(offer.validTill)}</>
                    ) : (
                        <>Valid till {formatDate(offer.validTill)}</>
                    )}
                </span>
            </div>
        </div>
    );
}
