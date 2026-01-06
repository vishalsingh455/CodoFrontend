import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const AddTestCase = () => {
    const { competitionId } = useParams();

    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState("");

    const [input, setInput] = useState("{}");
    const [expectedOutput, setExpectedOutput] = useState("{}");
    const [isHidden, setIsHidden] = useState(false);
    const [inputError, setInputError] = useState("");
    const [outputError, setOutputError] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchProblems = async () => {
        try {
            const res = await api.get(`/problems/competition/${competitionId}`);
            setProblems(res.data.problems || []);
            if (res.data.problems?.length) {
                setSelectedProblemId(res.data.problems[0]._id);
            }
        } catch {
            setError("Failed to load problems");
        }
    };

    const fetchProblemsMemo = useCallback(fetchProblems, [competitionId]);

    useEffect(() => {
        fetchProblemsMemo();
    }, [fetchProblemsMemo]);

    const addTestCase = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setInputError("");
        setOutputError("");

        if (!selectedProblemId) {
            setError("Please select a problem");
            return;
        }

        let parsedInput, parsedOutput;
        try {
            parsedInput = JSON.parse(input);
        } catch (err) {
            setInputError("Invalid JSON format for input");
            return;
        }

        try {
            parsedOutput = JSON.parse(expectedOutput);
        } catch (err) {
            setOutputError("Invalid JSON format for expected output");
            return;
        }

        try {
            setLoading(true);
            await api.post(`/problems/${selectedProblemId}/testcases`, {
                input: parsedInput,
                expectedOutput: parsedOutput,
                isHidden
            });
            setSuccess("Test case added successfully");
            setInput("{}");
            setExpectedOutput("{}");
            setIsHidden(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add test case");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
            <form
                onSubmit={addTestCase}
                className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl shadow-xl"
            >
                <h2 className="text-2xl text-white font-bold mb-6">
                    Add Test Case
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Problem
                    </label>
                    <select
                        value={selectedProblemId}
                        onChange={(e) => setSelectedProblemId(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                    >
                        {problems.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.title} ({p.difficulty})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Input Arguments (JSON)
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={6}
                            placeholder={`{"nums": [2, 7, 11, 15], "target": 9}`}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white font-mono text-sm"
                        />
                        {inputError && (
                            <p className="text-red-400 text-xs mt-1">{inputError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expected Return Value (JSON)
                        </label>
                        <textarea
                            value={expectedOutput}
                            onChange={(e) => setExpectedOutput(e.target.value)}
                            rows={6}
                            placeholder={`true`}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white font-mono text-sm"
                        />
                        {outputError && (
                            <p className="text-red-400 text-xs mt-1">{outputError}</p>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isHidden}
                        onChange={(e) => setIsHidden(e.target.checked)}
                        className="h-4 w-4 rounded bg-gray-800 border-gray-700"
                    />
                    <span className="text-gray-300 text-sm">
                        Hidden test case
                    </span>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mt-4">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-400 text-sm mt-4">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed py-2 rounded text-white font-semibold"
                >
                    {loading ? "Adding..." : "Add Test Case"}
                </button>
            </form>
        </div>
    );
};

export default AddTestCase;
