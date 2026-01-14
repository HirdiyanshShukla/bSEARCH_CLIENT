import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";

export default function ItemManager() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        available: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await ownerService.createItem(placeId, {
                ...formData,
                price: Number(formData.price)
            });
            navigate("/owner");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                <h2 className="text-2xl font-bold mb-6">Add New Item</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Item Name
                        </label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            min="0"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="available"
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-emerald-500"
                            checked={formData.available}
                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        />
                        <label htmlFor="available" className="text-sm font-medium text-zinc-300">
                            Available for order
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/owner")}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
