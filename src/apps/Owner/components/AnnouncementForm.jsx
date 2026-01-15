import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";
import OwnerLayout from "../components/OwnerLayout";
import Input from "../../Auth/components/Input";
import Button from "../../Auth/components/Button";

export default function AnnouncementForm() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ message: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await ownerService.createAnnouncement({
                placeId,
                message: formData.message
            });
            navigate("/owner");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create announcement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <OwnerLayout showNav={false}>
            <div className="owner-form-container">
                <div className="owner-form-card">
                    <h2 className="owner-form-title">Make Announcement</h2>

                    {error && (
                        <div className="message message-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="owner-form">
                        <div className="input-group">
                            <label className="input-label">
                                Message <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                name="message"
                                className="textarea-field"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Enter your announcement message"
                                required
                                rows="5"
                            />
                        </div>

                        <div className="owner-form-actions">
                            <button
                                type="button"
                                onClick={() => navigate("/owner")}
                                className="btn btn-cancel"
                            >
                                Cancel
                            </button>
                            <Button type="submit" loading={loading}>
                                Create Announcement
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
}
