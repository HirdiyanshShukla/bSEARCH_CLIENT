import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerService from "../services/ownerService";

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
            await ownerService.createPoll(placeId, {
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
        <div className="min-h-screen bg-zinc-900 text-white p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-zinc-800 p-8 rounded-xl border border-zinc-700">
                <h2 className="text-2xl font-bold mb-6">Create Poll</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Question
                        </label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            placeholder="What would you like to ask?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Options
                        </label>
                        <div className="space-y-2">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        required
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="text-zinc-500 hover:text-red-500 px-2"
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
                            className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                        >
                            + Add Option
                        </button>
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
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Poll"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
