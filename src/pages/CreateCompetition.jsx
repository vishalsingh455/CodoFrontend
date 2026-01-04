import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateCompetition = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const createCompetition = async (e) => {
        e.preventDefault();
        setError("");

        if (!title || !startTime || !endTime) {
            setError("All fields are required");
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            setError("End time must be after start time");
            return;
        }

        try {
            // Convert IST datetime-local to UTC ISO string
            const startUTC = new Date(startTime).toISOString();
            const endUTC = new Date(endTime).toISOString();

            await api.post("/competitions/create", {
                title,
                description,
                startTime: startUTC,
                endTime: endUTC
            });

            navigate("/organizer");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create competition"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <form
                onSubmit={createCompetition}
                className="bg-gray-900 p-8 rounded-xl w-96 shadow-xl"
            >
                <h2 className="text-2xl text-white font-bold mb-6">
                    Create Competition
                </h2>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Competition Title"
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Start Time */}
                <label className="text-gray-400 text-sm">
                    Start Time (IST)
                </label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* End Time */}
                <label className="text-gray-400 text-sm">
                    End Time (IST)
                </label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {error && (
                    <p className="text-red-400 text-sm mb-3">
                        {error}
                    </p>
                )}

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
                    Create Competition
                </button>
            </form>
        </div>
    );
};

export default CreateCompetition;
