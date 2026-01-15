import { useEffect, useState } from "react";
import ownerService from "../services/ownerService";
import OwnerBusinessCard from "../components/OwnerBusinessCard";
import OwnerLayout from "../components/OwnerLayout";


export default function OwnerHome() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const res = await ownerService.getMyBusinesses();
      setBusinesses(res.data.data || []);
    } catch (error) {
      console.error("Failed to load businesses:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout title="My Businesses">
      {loading ? (
        <div className="owner-loading-state">
          <div className="spinner-large"></div>
          <p className="owner-loading-text">Loading your businesses...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="owner-empty-state">
          <svg className="owner-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="owner-empty-title">No businesses found</h3>
          <p className="owner-empty-text">You haven't claimed any businesses yet.</p>
        </div>
      ) : (
        <div className="owner-business-grid">
          {businesses.map(b => (
            <OwnerBusinessCard key={b.placeId} business={b} />
          ))}
        </div>
      )}
    </OwnerLayout>
  );
}
