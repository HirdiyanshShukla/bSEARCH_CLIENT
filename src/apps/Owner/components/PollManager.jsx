import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";
import OwnerLayout from "../components/OwnerLayout";
import Input from "../../Auth/components/Input";
import Button from "../../Auth/components/Button";

export default function PollManager() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Filter out empty options
        const validOptions = options.filter(opt => opt.trim() !== "");

        if (validOptions.length < 2) {
            setError("Please provide at least 2 options");
            setLoading(false);
            return;
        }

        try {
            await ownerService.createPoll({
                placeId,
                question,
                options: validOptions
            });
            navigate("/owner");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <OwnerLayout showNav={false}>
            <div className="owner-form-container">
                <div className="owner-form-card">
                    <h2 className="owner-form-title">Create Poll</h2>

                    {error && (
                        <div className="message message-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="owner-form">
                        <Input
                            label="Question"
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What would you like to ask?"
                            required
                        />

                        <div className="input-group">
                            <label className="input-label">
                                Options <span className="text-rose-400">*</span>
                            </label>
                            <div className="poll-options-container">
                                {options.map((option, index) => (
                                    <div key={index} className="poll-option-row">
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            required
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="btn-remove-option"
                                                title="Remove option"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addOption}
                                className="btn-add-option"
                            >
                                + Add Option
                            </button>
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
                                Create Poll
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
}
