import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const AddProblem = () => {
    const { competitionId } = useParams();

    const [title, setTitle] = useState("");
    const [statement, setStatement] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [constraints, setConstraints] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const addProblem = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic frontend validation
        if (
            !title ||
            !statement ||
            !inputFormat ||
            !outputFormat ||
            !constraints
        ) {
            setError("All fields are required");
            return;
        }

        try {
            await api.post(
                `/competitions/${competitionId}/problems`,
                {
                    title,
                    statement,
                    inputFormat,
                    outputFormat,
                    constraints,
                    difficulty
                }
            );

            setSuccess("Problem added successfully");

            // Clear form
            setTitle("");
            setStatement("");
            setInputFormat("");
            setOutputFormat("");
            setConstraints("");
            setDifficulty("easy");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to add problem"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <form
                onSubmit={addProblem}
                className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl shadow-xl"
            >
                <h2 className="text-2xl text-white font-bold mb-6">
                    Add Problem
                </h2>

                {/* Title */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Problem Title"
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Statement */}
                <textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Problem Statement"
                    rows={4}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Input Format */}
                <textarea
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    placeholder="Input Format"
                    rows={2}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Output Format */}
                <textarea
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    placeholder="Output Format"
                    rows={2}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Constraints */}
                <textarea
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Constraints"
                    rows={2}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Difficulty */}
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <p className="text-gray-400 text-xs mb-4">
                    Points per test case: {difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15}
                </p>

                {/* Error / Success */}
                {error && (
                    <p className="text-red-400 text-sm mb-3">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-400 text-sm mb-3">
                        {success}
                    </p>
                )}

                {/* Submit */}
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
                    Add Problem
                </button>
            </form>
        </div>
    );
};

export default AddProblem;
