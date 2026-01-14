import { useEffect, useState } from "react";
import ownerService from "../services/ownerService";
import OwnerBusinessCard from "../components/OwnerBusinessCard";

export default function OwnerHome() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    const res = await ownerService.getMyBusinesses();
    setBusinesses(res.data);
  };

  return (
    <div className="owner-container">
      <h1 className="text-3xl font-bold mb-6">My Businesses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map(b => (
          <OwnerBusinessCard key={b.placeId} business={b} />
        ))}
      </div>
    </div>
  );
}
