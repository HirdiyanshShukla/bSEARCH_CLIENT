import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";
import OwnerLayout from "../components/OwnerLayout";
import Input from "../../Auth/components/Input";
import Button from "../../Auth/components/Button";

export default function OfferManager() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        validTill: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fetchingOffers, setFetchingOffers] = useState(true);

    useEffect(() => {
        loadOffers();
    }, [placeId]);

    const loadOffers = async () => {
        try {
            setFetchingOffers(true);
            const response = await ownerService.getOffers(placeId);
            setOffers(response.data.data || []);
        } catch (err) {
            console.error("Failed to load offers:", err);
            setOffers([]);
        } finally {
            setFetchingOffers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await ownerService.createOffer({
                placeId,
                ...formData
            });
            setFormData({ title: "", description: "", validTill: "" });
            await loadOffers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create offer");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (offerId) => {
        if (!confirm("Are you sure you want to delete this offer?")) return;

        try {
            await ownerService.deleteOffer(offerId);
            setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete offer");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <OwnerLayout showNav={false}>
            <div className="owner-form-container">
                <div className="owner-form-card">
                    <div className="owner-form-header">
                        <h2 className="owner-form-title">Manage Offers</h2>
                        <button
                            onClick={() => navigate("/owner")}
                            className="btn btn-back"
                        >
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {error && <div className="message message-error">{error}</div>}

                    {/* Create Offer Form */}
                    <form onSubmit={handleSubmit} className="owner-form">
                        <h3 className="owner-form-subtitle">Create New Offer</h3>

                        <Input
                            label="Offer Title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Flat 20% Off"
                            required
                        />

                        <div className="input-group">
                            <label className="input-label">
                                Description <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                name="description"
                                className="textarea-field"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g., On all main course items"
                                required
                                rows="3"
                            />
                        </div>

                        <Input
                            label="Valid Till"
                            type="date"
                            name="validTill"
                            value={formData.validTill}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />

                        <Button type="submit" loading={loading}>
                            Create Offer
                        </Button>
                    </form>

                    {/* Offers List */}
                    <div className="owner-items-list">
                        <h3 className="owner-form-subtitle">Active Offers</h3>

                        {fetchingOffers ? (
                            <div className="owner-loading-state">
                                <div className="spinner-large"></div>
                            </div>
                        ) : offers.length === 0 ? (
                            <div className="owner-empty-state">
                                <p className="owner-empty-text">No offers created yet</p>
                            </div>
                        ) : (
                            <div className="owner-items-grid">
                                {offers.map((offer) => (
                                    <div key={offer._id} className="owner-item-card">
                                        <div className="owner-offer-content">
                                            <h4 className="owner-item-name">{offer.title}</h4>
                                            <p className="owner-item-description">{offer.description}</p>
                                            <p className="owner-offer-validity">
                                                <svg className="info-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Valid till: {formatDate(offer.validTill)}
                                            </p>
                                        </div>

                                        <div className="owner-item-actions">
                                            <button
                                                onClick={() => handleDelete(offer._id)}
                                                className="btn btn-danger"
                                            >
                                                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
}
