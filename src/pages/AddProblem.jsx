import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { generateStarterTemplates } from "../utils/codeTemplates";

const AddProblem = () => {
    const { competitionId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [functionName, setFunctionName] = useState("");
    const [returnType, setReturnType] = useState("");
    const [parameters, setParameters] = useState([{ name: "", type: "" }]);
    const [starterTemplates, setStarterTemplates] = useState({
        python: "",
        javascript: "",
        java: "",
        cpp: ""
    });
    const [constraints, setConstraints] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const addParameter = () => {
        setParameters([...parameters, { name: "", type: "" }]);
    };

    const updateParameter = (index, field, value) => {
        const newParams = [...parameters];
        newParams[index][field] = value;
        setParameters(newParams);
    };

    const removeParameter = (index) => {
        if (parameters.length > 1) {
            setParameters(parameters.filter((_, i) => i !== index));
        }
    };

    // Auto-generate starter templates when function signature changes
    useEffect(() => {
        if (functionName && returnType) {
            const validParams = parameters.filter(p => p.name && p.type);
            const templates = generateStarterTemplates(functionName, returnType, validParams);
            setStarterTemplates(templates);
        }
    }, [functionName, returnType, parameters]);

    const updateStarterTemplate = (language, code) => {
        setStarterTemplates({
            ...starterTemplates,
            [language]: code
        });
    };

    const addProblem = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic frontend validation
        if (!title) {
            setError("Problem title is required");
            return;
        }
        if (!description) {
            setError("Problem description is required");
            return;
        }
        if (!functionName) {
            setError("Function name is required");
            return;
        }
        if (!returnType) {
            setError("Return type is required");
            return;
        }

        // Validate parameters - only check parameters that have been filled
        const filledParams = parameters.filter(p => p.name.trim() || p.type.trim());
        for (const param of filledParams) {
            if (!param.name.trim() || !param.type.trim()) {
                setError("All parameter fields must be filled");
                return;
            }
        }

        try {
            await api.post(
                `/competitions/${competitionId}/problems`,
                {
                    title,
                    description,
                    functionName,
                    returnType,
                    parameters: parameters.filter(p => p.name && p.type),
                    starterTemplates,
                    constraints,
                    difficulty
                }
            );

            setSuccess("Problem added successfully");

            // Clear form
            setTitle("");
            setDescription("");
            setFunctionName("");
            setReturnType("");
            setParameters([{ name: "", type: "" }]);
            setStarterTemplates({
                python: "",
                javascript: "",
                java: "",
                cpp: ""
            });
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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center py-8">
            <form
                onSubmit={addProblem}
                className="bg-gray-900 p-8 rounded-xl w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]"
            >
                <h2 className="text-2xl text-white font-bold mb-6">
                    Add Function-Based Problem
                </h2>

                {/* Title */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Problem Title"
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Description */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Problem Description"
                    rows={4}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                {/* Function Signature */}
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Function Signature</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            value={returnType}
                            onChange={(e) => setReturnType(e.target.value)}
                            placeholder="Return Type (e.g., int, String, boolean)"
                            className="px-4 py-2 rounded bg-gray-700 text-white"
                        />
                        <input
                            value={functionName}
                            onChange={(e) => setFunctionName(e.target.value)}
                            placeholder="Function Name (e.g., twoSum, maxProfit)"
                            className="px-4 py-2 rounded bg-gray-700 text-white"
                        />
                    </div>

                    {/* Parameters */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-300 font-medium">Parameters</h4>
                            <button
                                type="button"
                                onClick={addParameter}
                                className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm text-white"
                            >
                                Add Parameter
                            </button>
                        </div>
                        {parameters.map((param, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    value={param.type}
                                    onChange={(e) => updateParameter(index, 'type', e.target.value)}
                                    placeholder="Type (e.g., int[], String)"
                                    className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-sm"
                                />
                                <input
                                    value={param.name}
                                    onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                    placeholder="Name (e.g., nums, target)"
                                    className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-sm"
                                />
                                {parameters.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeParameter(index)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Starter Code Templates */}
                <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Starter Code Templates</h3>
                    <p className="text-gray-400 text-sm mb-4">Auto-generated based on function signature</p>

                    {/* Python */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Python:</label>
                        <textarea
                            value={starterTemplates.python}
                            readOnly
                            rows={6}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 font-mono text-sm cursor-not-allowed"
                        />
                    </div>

                    {/* JavaScript */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">JavaScript:</label>
                        <textarea
                            value={starterTemplates.javascript}
                            readOnly
                            rows={6}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 font-mono text-sm cursor-not-allowed"
                        />
                    </div>

                    {/* Java */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Java:</label>
                        <textarea
                            value={starterTemplates.java}
                            readOnly
                            rows={6}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 font-mono text-sm cursor-not-allowed"
                        />
                    </div>

                    {/* C++ */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">C++:</label>
                        <textarea
                            value={starterTemplates.cpp}
                            readOnly
                            rows={6}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 font-mono text-sm cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Constraints */}
                <textarea
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Constraints (optional)"
                    rows={3}
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
