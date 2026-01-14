import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../Auth/context/AuthContext';
import SearchForm from '../components/SearchForm';
import BusinessCard from '../components/BusinessCard';
import ClaimModal from '../components/ClaimModal';
import businessService from '../services/businessService';

export default function HomePage() {
  const { logout } = useAuth();
  const { user } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const resultsRef = useRef(null);

  // Reset when user changes
  useEffect(() => {
    setBusinesses([]);
    setSearched(false);
    setError('');
  }, [user]);

  // Restore previous search
  useEffect(() => {
    const savedResults = sessionStorage.getItem('searchResults');
    const savedSearched = sessionStorage.getItem('searched');

    if (savedResults) setBusinesses(JSON.parse(savedResults));
    if (savedSearched === 'true') setSearched(true);
  }, []);

  const handleSearch = async (location, type) => {
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const response = await businessService.searchBusinesses(location, type);
      const results = response.data?.data || [];

      setBusinesses(results);

      sessionStorage.setItem('searchResults', JSON.stringify(results));
      sessionStorage.setItem('searched', 'true');

      // 🧭 Auto scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimClick = (business) => {
    setSelectedBusiness(business);
  };

  const handleClaimSuccess = () => {
    setSelectedBusiness(null);
  };

  return (
    <div className="home-container">

      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-content">
          <h1 className="nav-logo">
            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Business Search
          </h1>

          <button onClick={logout} className="btn btn-outline">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Search Section */}
      <div className="search-section">
        <SearchForm onSearch={handleSearch} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div className="results-container">
          <div className="message message-error">{error}</div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="results-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p className="loading-text">Searching for businesses...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searched && businesses.length === 0 && !error && (
        <div className="results-container">
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="empty-title">No businesses found</h3>
            <p className="empty-text">Try a different location or business type.</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && businesses.length > 0 && (
        <div className="results-container" ref={resultsRef}>
          <div className="results-header">
            <h2 className="results-title">
              Found {businesses.length} businesses
            </h2>
          </div>

          <div className="business-grid">
            {[...businesses]
              .sort((a, b) => Number(b.claimed) - Number(a.claimed))
              .map((business) => (
                <BusinessCard
                  key={business.placeId}
                  business={business}
                  onClaim={handleClaimClick}
                />
              ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {selectedBusiness && (
        <ClaimModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
}
