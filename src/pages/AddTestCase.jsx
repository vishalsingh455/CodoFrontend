// import { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import api from "../services/api";

// const AddTestCase = () => {
//     const { competitionId } = useParams();

//     const [problems, setProblems] = useState([]);
//     const [selectedProblemId, setSelectedProblemId] = useState("");

//     const [input, setInput] = useState("");
//     const [expectedOutput, setExpectedOutput] = useState("");
//     const [isHidden, setIsHidden] = useState(false);
//     const [inputError, setInputError] = useState("");
//     const [outputError, setOutputError] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const fetchProblems = async () => {
//         try {
//             const res = await api.get(`/problems/competition/${competitionId}`);
//             setProblems(res.data.problems || []);
//             if (res.data.problems?.length) {
//                 setSelectedProblemId(res.data.problems[0]._id);
//             }
//         } catch {
//             setError("Failed to load problems");
//         }
//     };

//     const fetchProblemsMemo = useCallback(fetchProblems, [competitionId]);

//     useEffect(() => {
//         fetchProblemsMemo();
//     }, [fetchProblemsMemo]);

//     const addTestCase = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");
//         setInputError("");
//         setOutputError("");

//         if (!selectedProblemId) {
//             setError("Please select a problem");
//             return;
//         }

//         let parsedInput, parsedOutput;
//         try {
//             parsedInput = JSON.parse(input);
//         } catch (err) {
//             setInputError("Invalid JSON format for input");
//             return;
//         }

//         try {
//             parsedOutput = JSON.parse(expectedOutput);
//         } catch (err) {
//             setOutputError("Invalid JSON format for expected output");
//             return;
//         }

//         try {
//             setLoading(true);
//             await api.post(`/problems/${selectedProblemId}/testcases`, {
//                 input: parsedInput,
//                 expectedOutput: parsedOutput,
//                 isHidden
//             });
//             setSuccess("Test case added successfully");
//             setInput("{}");
//             setExpectedOutput("{}");
//             setIsHidden(false);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to add test case");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
//             <form
//                 onSubmit={addTestCase}
//                 className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl shadow-xl"
//             >
//                 <h2 className="text-2xl text-white font-bold mb-6">
//                     Add Test Case
//                 </h2>

//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Select Problem
//                     </label>
//                     <select
//                         value={selectedProblemId}
//                         onChange={(e) => setSelectedProblemId(e.target.value)}
//                         className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//                     >
//                         {problems.map((p) => (
//                             <option key={p._id} value={p._id}>
//                                 {p.title} ({p.difficulty})
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">
//                             Input Arguments (JSON)
//                         </label>
//                         <textarea
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             rows={6}
//                             placeholder={`{"nums": [2, 7, 11, 15], "target": 9}`}
//                             className="w-full px-4 py-2 rounded bg-gray-800 text-white font-mono text-sm"
//                         />
//                         {inputError && (
//                             <p className="text-red-400 text-xs mt-1">{inputError}</p>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">
//                             Expected Return Value (JSON)
//                         </label>
//                         <textarea
//                             value={expectedOutput}
//                             onChange={(e) => setExpectedOutput(e.target.value)}
//                             rows={6}
//                             placeholder={`true`}
//                             className="w-full px-4 py-2 rounded bg-gray-800 text-white font-mono text-sm"
//                         />
//                         {outputError && (
//                             <p className="text-red-400 text-xs mt-1">{outputError}</p>
//                         )}
//                     </div>
//                 </div>

//                 <div className="mt-4 flex items-center gap-2">
//                     <input
//                         type="checkbox"
//                         checked={isHidden}
//                         onChange={(e) => setIsHidden(e.target.checked)}
//                         className="h-4 w-4 rounded bg-gray-800 border-gray-700"
//                     />
//                     <span className="text-gray-300 text-sm">
//                         Hidden test case
//                     </span>
//                 </div>

//                 {error && (
//                     <p className="text-red-400 text-sm mt-4">
//                         {error}
//                     </p>
//                 )}

//                 {success && (
//                     <p className="text-green-400 text-sm mt-4">
//                         {success}
//                     </p>
//                 )}

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed py-2 rounded text-white font-semibold"
//                 >
//                     {loading ? "Adding..." : "Add Test Case"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddTestCase;


import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const AddTestCase = () => {
    const { competitionId } = useParams();

    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState("");

    const [input, setInput] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
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

    const selectedProblem = problems.find(p => p._id === selectedProblemId);
    const diffColor = selectedProblem?.difficulty === 'easy' ? 'text-green-400' : selectedProblem?.difficulty === 'medium' ? 'text-yellow-400' : selectedProblem?.difficulty === 'hard' ? 'text-red-400' : 'text-gray-400';

    return (
        <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 relative">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(12px,-14px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-14px,14px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                @keyframes shakeX { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
                @keyframes checkPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
                .anim-fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .35s ease both; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 12s ease-in-out infinite; }
                .anim-shake { animation: shakeX .5s ease-in-out; }
                .anim-check-pop { animation: checkPop .25s cubic-bezier(.34,1.56,.64,1) both; }
                .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 16s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .field-focus { transition: border-color .2s ease, box-shadow .2s ease; }
                .field-focus:focus { outline: none; border-color: rgba(124,92,255,0.6); box-shadow: 0 0 0 3px rgba(124,92,255,0.15); }
                .btn-shine { position: relative; overflow: hidden; }
                .btn-shine::after { content: ""; position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent); transform: translateX(-120%) skewX(-20deg); }
                .btn-shine:hover::after { animation: shine .8s ease; }
                @keyframes shine { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(220%) skewX(-20deg); } }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-float-a, .anim-float-b, .anim-shake, .anim-check-pop, .bg-grid, .btn-shine:hover::after { animation: none !important; }
                }
            `}</style>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-a" />
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl anim-float-b" />
            </div>

            <form
                onSubmit={addTestCase}
                className="anim-fade-up relative z-10 bg-[#12161f]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/50"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-md opacity-30" />
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div>
                        
                        <h2 className="text-2xl text-white font-bold">
                            Add Test Case
                        </h2>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-2">
                        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-3.75L12 17.25m4.5-9.75h-3m1.5 0V3.104" /></svg>
                        Select Problem
                    </label>
                    <div className="relative">
                        <select
                            value={selectedProblemId}
                            onChange={(e) => setSelectedProblemId(e.target.value)}
                            className="field-focus appearance-none w-full px-4 py-2.5 rounded-lg bg-gray-800/70 border border-white/10 text-white cursor-pointer"
                        >
                            {problems.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.title} ({p.difficulty})
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                    {selectedProblem && (
                        <p className={`mt-1.5 text-xs font-mono-ui ${diffColor} anim-fade-in`}>
                            {selectedProblem.difficulty} difficulty
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
                                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                                Input Arguments
                            </label>
                            <span className="text-[10px] font-mono-ui text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">JSON</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={6}
                            placeholder={`{"nums": [2, 7, 11, 15], "target": 9}`}
                            className="field-focus w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-indigo-300 font-mono-ui text-sm placeholder-gray-600"
                        />
                        {inputError && (
                            <p className="anim-shake flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                {inputError}
                            </p>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
                                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Expected Return Value
                            </label>
                            <span className="text-[10px] font-mono-ui text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">JSON</span>
                        </div>
                        <textarea
                            value={expectedOutput}
                            onChange={(e) => setExpectedOutput(e.target.value)}
                            rows={6}
                            placeholder={`true`}
                            className="field-focus w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-green-300 font-mono-ui text-sm placeholder-gray-600"
                        />
                        {outputError && (
                            <p className="anim-shake flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                {outputError}
                            </p>
                        )}
                    </div>
                </div>

                <label className="mt-5 flex items-center gap-3 cursor-pointer select-none w-fit">
                    <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-md border border-white/20 bg-gray-800/70 transition-colors"
                        style={isHidden ? { backgroundColor: '#7c5cff', borderColor: '#7c5cff' } : {}}
                    >
                        <input
                            type="checkbox"
                            checked={isHidden}
                            onChange={(e) => setIsHidden(e.target.checked)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {isHidden && (
                            <svg className="anim-check-pop w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        )}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        Hidden test case
                    </span>
                </label>

                {error && (
                    <div className="anim-fade-up mt-4 flex items-center gap-2.5 p-3 rounded-lg text-sm font-medium border bg-red-900/20 text-red-300 border-red-700/50">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="anim-fade-up mt-4 flex items-center gap-2.5 p-3 rounded-lg text-sm font-medium border bg-green-900/20 text-green-300 border-green-700/50">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-shine mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-600/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] py-2.5 rounded-lg text-white font-semibold transition-all"
                >
                    {loading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    )}
                    {loading ? "Adding..." : "Add Test Case"}
                </button>
            </form>
        </div>
    );
};

export default AddTestCase;
