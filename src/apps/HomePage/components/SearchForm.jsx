import { useState } from 'react';

export default function SearchForm({ onSearch, loading }) {
    const [location, setLocation] = useState('');
    const [businessType, setBusinessType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (location.trim() && businessType.trim()) {
            onSearch(location.trim(), businessType.trim());
        }
    };

    const popularTypes = [
        'Restaurant',
        'Cafe',
        'Hotel',
        'Gym',
        'Salon',
        'Shop',
        'Hospital',
        'School',
    ];

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-form-content">
                <h2 className="search-title">Discover Local Businesses</h2>
                <p className="search-subtitle">Search for verified and unverified businesses in your area</p>

                <div className="search-inputs">
                    <div className="input-group">
                        <label htmlFor="location" className="input-label">
                            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Delhi, Mumbai, Bangalore"
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="businessType" className="input-label">
                            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Business Type
                        </label>
                        <input
                            id="businessType"
                            type="text"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            placeholder="e.g., Restaurant, Cafe, Hotel"
                            className="input-field"
                            list="business-types"
                            required
                        />
                        <datalist id="business-types">
                            {popularTypes.map((type) => (
                                <option key={type} value={type} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-search"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search Businesses</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
