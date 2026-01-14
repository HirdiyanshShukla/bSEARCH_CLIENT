import { useNavigate } from "react-router-dom";

export default function OwnerBusinessCard({ business }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/business/${business.placeId}`)}
      className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 hover:border-blue-500 transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{business.name}</h3>
          <p className="text-zinc-400 mt-1">{business.address}</p>
        </div>

        <span className="px-3 py-1 text-sm rounded-full bg-green-600 text-white">
          Verified
        </span>
      </div>

      <div className="mt-4 text-sm text-zinc-300">
        <p><strong>Category:</strong> {business.category}</p>
        {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
        {business.website && <p><strong>Website:</strong> {business.website}</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/owner/announcement/${business.placeId}`);
          }}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Announcement
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/owner/item/${business.placeId}`);
          }}
          className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
        >
          Add Item
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/owner/poll/${business.placeId}`);
          }}
          className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
}
