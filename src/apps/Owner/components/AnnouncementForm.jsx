import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";

export default function AnnouncementForm() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await ownerService.createAnnouncement(placeId, formData);
            navigate("/owner");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create announcement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                <h2 className="text-2xl font-bold mb-6">Make Announcement</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Message
                        </label>
                        <textarea
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 h-32"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
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
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
