


// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import CodeEditor from "../components/CodeEditor";
// import CompetitionTimer from "../components/CompetitionTimer";
// import api from "../services/api";

// const SolveProblem = () => {
//     const { problemId } = useParams(); // ✅ FROM URL

//     const [problem, setProblem] = useState(null);
//     const [testCases, setTestCases] = useState([]);
//     const [language, setLanguage] = useState("python");
//     const [code, setCode] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [submissions, setSubmissions] = useState([]);
//     const [activeTab, setActiveTab] = useState('editor');//mm
//     const [leftWidth, setLeftWidth] = useState(50); // %
//     const [isResizing, setIsResizing] = useState(false);
//     const [analysisResult, setAnalysisResult] = useState(null);
//     const [analyzing, setAnalyzing] = useState(false);


//     const fetchProblemDetails = useCallback(async () => {
//         try {
//             // Get problem details
//             const problemRes = await api.get(`/problems/${problemId}`);
//             setProblem(problemRes.data.problem);

//             // Set default code template based on language from starter templates
//             const starterCode = problemRes.data.problem.starterTemplates?.[language] || problemRes.data.problem.starterTemplates?.python || '';
//             setCode(starterCode);

//             // Get test cases for this problem (only visible ones)
//             const testCasesRes = await api.get(`/problems/${problemId}/testcases`);
//             setTestCases(testCasesRes.data.testCases || []);

//         } catch (error) {
//             console.error("Error fetching problem details:", error);
//         }
//     }, [problemId, language]);

//     useEffect(() => {
//         fetchProblemDetails();
//     }, [fetchProblemDetails]);
//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             if (!isResizing) return;

//             const newWidth = (e.clientX / window.innerWidth) * 100;
//             if (newWidth > 20 && newWidth < 70) {
//                 setLeftWidth(newWidth);
//             }
//         };

//         const handleMouseUp = () => {
//             setIsResizing(false);
//         };

//         window.addEventListener("mousemove", handleMouseMove);
//         window.addEventListener("mouseup", handleMouseUp);

//         return () => {
//             window.removeEventListener("mousemove", handleMouseMove);
//             window.removeEventListener("mouseup", handleMouseUp);
//         };
//     }, [isResizing]);
//     useEffect(() => {
//       setActiveTab('problem');
//     }, [])
    


//     const runCode = async () => {
//         try {
//             setLoading(true);
//             setMessage("");

//             const response = await api.post(`/problems/${problemId}/run`, {
//                 language,
//                 code
//             });

//             const { passed, total, error } = response.data;
//             if (error) {
//                 setMessage(`❌ Runtime Error: ${error}`);
//             } else {
//                 setMessage(`✅ Run completed! Passed ${passed}/${total} test cases`);
//             }

//         } catch (error) {
//             setMessage(`❌ Run failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const submitCode = async () => {
//         try {
//             setLoading(true);
//             setMessage("");

//             await api.post(`/problems/${problemId}/submit`, {
//                 language,
//                 code
//             });

//             setMessage("✅ Code submitted successfully!");

//             // Optionally fetch recent submissions to show results
//             const submissionsRes = await api.get('/my-submissions');
//             setSubmissions(submissionsRes.data.submissions || []);

//         } catch (error) {
//             setMessage(`❌ Submission failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const analyzeCode = async () => {
//         try {
//             setAnalyzing(true);
//             setAnalysisResult(null);

//             const response = await api.post('/ai/analyze-complexity', {
//                 language,
//                 code
//             });

//             if (response.data.success) {
//                 setAnalysisResult(response.data.result);
//             } else {
//                 setMessage(`❌ Analysis failed: ${response.data.message}`);
//             }

//         } catch (error) {
//             setMessage(`❌ Analysis failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setAnalyzing(false);
//         }
//     };



//     const getDifficultyColor = (difficulty) => {
//         switch (difficulty) {
//             case 'easy': return 'text-green-500';
//             case 'medium': return 'text-yellow-500';
//             case 'hard': return 'text-red-500';
//             default: return 'text-gray-500';
//         }
//     };

//     const sanitizeJavaScriptCode = (code, problem) => {
//         if (!problem) return code;

//         // If function already has JS-style signature, do nothing
//         if (/function\s+\w+\s*\(.*\)/.test(code)) {
//             return code.replace(/\b(number|string|boolean)\s+/g, '');
//         }

//         // Build JS-style function signature
//         const params = problem.parameters?.map(p => p.name).join(', ') || '';

//         return `function ${problem.functionName}(${params}) {
//     // write your code here
// }
// `;
//     };
//     if (!problem) {
//         return (
//             <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-950">
//             {/* Header */}
//             <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
//                 <div className="max-w-7xl mx-auto">
//                     {/* Title Row */}
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
//                             <div className="flex items-center gap-4 mt-2">
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)} bg-gray-800`}>
//                                     {problem.difficulty}
//                                 </span>
//                                 <span className="text-sm text-gray-300">
//                                     Points per test case: <span className="text-white font-medium">{problem.marksPerTestCase}</span>
//                                 </span>
//                             </div>
//                         </div>
//                         {problem.competition && (
//                             <CompetitionTimer
//                                 startTime={problem.competition.startTime}
//                                 endTime={problem.competition.endTime}
//                             />
//                         )}
//                         {/* Debug: Show raw competition data */}
//                         //{console.log('Problem competition data:', problem.competition)}
//                     </div>

//                     {/* Controls Row */}
//                     <div className="flex flex-wrap items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                             <select
//                                 value={language}
//                                 onChange={(e) => {
//                                     setLanguage(e.target.value);
//                                     // Use the proper starter template for the selected language
//                                     const starterCode = problem.starterTemplates?.[e.target.value] || problem.starterTemplates?.python || '';
//                                     setCode(starterCode);
//                                 }}
//                                 className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
//                             >
//                                 <option value="python">Python</option>
//                                 <option value="cpp">C++</option>
//                                 <option value="java">Java</option>
//                                 <option value="javascript">JavaScript</option>
//                             </select>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={runCode}
//                                 disabled={loading}
//                                 className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
//                             >
//                                 {loading ? "Running..." : "Run Code"}
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     submitCode()
//                                     setActiveTab('submissions')
//                                 }}
//                                 disabled={loading}
//                                 className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
//                             >
//                                 {loading ? "Submitting..." : "Submit Code"}
//                             </button>
//                             {/* <button
//                                 onClick={analyzeCode}
//                                 disabled={analyzing}
//                                 className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
//                             >
//                                 {analyzing ? "Analyzing..." : "Analyze Complexity"}
//                             </button> */}
//                         </div>
//                     </div>
//                 </div>
//                 {message && (
//                     <div className="max-w-7xl mx-auto mt-[-20px]">
//                         <p className={`text-center p-3 rounded w-fit mx-auto ${message.includes('✅') ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'}`}>
//                             {message}
//                         </p>
//                     </div>
//                 )}


//             </div>

//             {/* Main Content */}
//             <div className="flex h-[calc(100vh-80px)]">
//                 {/* Left Panel - Tabs */}
//                 <div className="flex flex-col min-h-0"
//                     style={{ width: `${leftWidth}%` }}>
//                     {/* Tabs */}
//                     <div className="flex border-b border-gray-800 bg-gray-900/50">
//                         <button
//                             onClick={() => setActiveTab('problem')}
//                             className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'problem'
//                                 ? 'text-white bg-gray-800 border-b-2 border-indigo-500'
//                                 : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
//                                 }`}
//                         >
//                             Problem Description
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('submissions')}
//                             className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'submissions'
//                                 ? 'text-white bg-gray-800 border-b-2 border-indigo-500'
//                                 : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
//                                 }`}
//                         >
//                             Submissions
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('analysis')}
//                             className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'analysis'
//                                 ? 'text-white bg-gray-800 border-b-2 border-purple-500'
//                                 : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
//                                 }`}
//                         >
//                             Analysis
//                         </button>
//                     </div>

//                     {/* Tab Content */}
//                     <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
//                         {activeTab === 'problem' ? (
//                             <div className="p-6">
//                                 {/* Problem Description */}
//                                 <div className="mb-6">
//                                     <h2 className="text-xl font-bold text-white mb-4">Problem Description</h2>
//                                     <p className="text-gray-300 leading-relaxed">{problem.description}</p>
//                                 </div>

//                                 {/* Constraints */}
//                                 {problem.constraints && (
//                                     <div className="mb-6">
//                                         <h3 className="text-lg font-bold text-white mb-4">Constraints</h3>
//                                         <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
//                                             <p className="text-gray-300 text-sm">{problem.constraints}</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Sample Test Cases */}
//                                 <div className="mb-6">
//                                     <h3 className="text-xl font-bold text-white mb-4">Sample Test Cases</h3>
//                                     {testCases.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {testCases.map((testCase, index) => (
//                                                 <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
//                                                     <div className="grid grid-cols-1 gap-4">
//                                                         <div>
//                                                             <h4 className="font-medium text-gray-400 mb-2 text-sm">Input</h4>
//                                                             <pre className="bg-gray-900 p-3 rounded text-sm text-indigo-300 font-mono whitespace-pre-wrap border border-gray-700 overflow-x-auto">
//                                                                 {JSON.stringify(testCase.input, null, 2)}
//                                                             </pre>
//                                                         </div>
//                                                         <div>
//                                                             <h4 className="font-medium text-gray-400 mb-2 text-sm">Expected Output</h4>
//                                                             <pre className="bg-gray-900 p-3 rounded text-sm text-green-300 font-mono whitespace-pre-wrap border border-gray-700 overflow-x-auto">
//                                                                 {JSON.stringify(testCase.expectedOutput, null, 2)}
//                                                             </pre>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="text-gray-400 text-center py-4">No sample test cases available</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : activeTab === 'submissions' ? (
//                             <div className="h-full bg-gray-900/30">
//                                 {/* Submission History */}
//                                 <div className="h-full overflow-y-auto no-scrollbar">
//                                     {submissions.length > 0 ? (
//                                         <div className="h-full overflow-y-auto no-scrollbar">
//                                             {submissions
//                                                 .filter(sub => sub.problem._id === problemId)
//                                                 .slice(0, 10)
//                                                 .map((submission, index) => {
//                                                     const isLatest = index === 0; // Most recent submission
//                                                     return (
//                                                         <div
//                                                             key={submission._id}
//                                                             className={`px-4 py-3 border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors ${index === 0 ? 'border-t-0' : ''
//                                                                 }`}
//                                                         >
//                                                             {/* Header Row */}
//                                                             <div className="flex items-center justify-between mb-2">
//                                                                 <div className="flex items-center gap-3">
//                                                                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${submission.status === 'accepted'
//                                                                         ? 'bg-green-900/60 text-green-300 border border-green-700'
//                                                                         : 'bg-red-900/60 text-red-300 border border-red-700'
//                                                                         }`}>
//                                                                         {submission.status === 'accepted' ? '✓' : '✗'} {submission.status}
//                                                                     </span>
//                                                                     <span className="text-gray-400 text-xs">
//                                                                         {submission.language}
//                                                                     </span>
//                                                                     {isLatest && (
//                                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
//                                                                             Latest
//                                                                         </span>
//                                                                     )}
//                                                                 </div>
//                                                                 <span className="text-gray-500 text-xs">
//                                                                     {new Date(submission.createdAt).toLocaleString()}
//                                                                 </span>
//                                                             </div>

//                                                             {/* Score */}
//                                                             <div className="mb-2">
//                                                                 <span className="text-white text-sm font-medium">
//                                                                     Score: <span className="text-indigo-400">{submission.score}</span>
//                                                                 </span>
//                                                             </div>

//                                                             {/* Error Display - Only for latest submission */}
//                                                             {submission.error && isLatest && (
//                                                                 <div className="mt-2 bg-red-950/40 border border-red-800/50 rounded-md overflow-hidden">
//                                                                     <div className="px-3 py-2 bg-red-900/30 border-b border-red-800/50">
//                                                                         <div className="flex items-center gap-2">
//                                                                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                                                             <span className="text-red-400 text-xs font-medium">Runtime Error</span>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="p-3">
//                                                                         <div className="bg-red-900/20 border border-red-800/30 rounded text-xs font-mono text-red-300 p-2 max-h-24 overflow-y-auto overflow-x-auto no-scrollbar whitespace-pre-wrap break-words">
//                                                                             {submission.error}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     );
//                                                 })
//                                             }
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center justify-center h-full">
//                                             <div className="text-center">
//                                                 <div className="text-gray-500 text-sm mb-1">No submissions yet</div>
//                                                 <div className="text-gray-600 text-xs">Submit your code to see results here</div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : activeTab === 'analysis' ? (
//                             <div className="h-full bg-gray-900/30 p-6">
//                                 {analysisResult ? (
//                                     <div className="max-w-4xl mx-auto">
//                                         <h3 className="text-2xl font-bold text-white mb-6">Code Analysis</h3>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
//                                                 <div className="text-purple-300 text-sm font-medium mb-2">Time Complexity</div>
//                                                 <div className="text-white text-2xl font-bold">{analysisResult.time_complexity}</div>
//                                             </div>
//                                             <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
//                                                 <div className="text-purple-300 text-sm font-medium mb-2">Space Complexity</div>
//                                                 <div className="text-white text-2xl font-bold">{analysisResult.space_complexity}</div>
//                                             </div>
//                                             <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 md:col-span-2">
//                                                 <div className="text-purple-300 text-sm font-medium mb-3">Explanation</div>
//                                                 <div className="text-gray-300 text-base leading-relaxed">{analysisResult.explanation}</div>
//                                             </div>
//                                         </div>
//                                                 <button
//                                                     onClick={analyzeCode}
//                                                     disabled={analyzing}
//                                                     className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap ml-4 mt-10"
//                                                 >
//                                                     {analyzing ? "Analyzing..." : "Analyze Complexity"}
//                                                 </button>
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center justify-center h-full">
//                                         <div className="text-center">
//                                             <div className="text-gray-500 text-lg mb-2">No analysis yet</div>
//                                             <div className="text-gray-600 text-sm mb-4">Click "Analyze Complexity" to get AI-powered code analysis</div>
//                                             <button
//                                                 onClick={analyzeCode}
//                                                 disabled={analyzing}
//                                                 className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition"
//                                             >
//                                                 {analyzing ? "Analyzing..." : "Analyze Complexity"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : activeTab === 'code' ? (
//                             <div className="p-6">
//                                 {/* Function Signature */}
//                                 <div className="mb-6">
//                                     <h3 className="text-lg font-bold text-white mb-4">Function Signature</h3>
//                                     <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
//                                         <code className="text-indigo-400 font-mono text-sm">
//                                             {problem.returnType} {problem.functionName}({problem.parameters?.map((param, idx) =>
//                                                 `${param.type} ${param.name}${idx < (problem.parameters?.length || 0) - 1 ? ', ' : ''}`
//                                             ).join('') || ''})
//                                         </code>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : null}
//                     </div>
//                 </div>

//                 <div
//                     onMouseDown={() => setIsResizing(true)}
//                     className="w-1 cursor-col-resize bg-gray-800 hover:bg-indigo-500 transition"
//                     style={{ userSelect: "none" }}
//                 />

//                 {/* Right Panel - Code Editor */}
//                 <div className="border-l border-gray-800"
//                     style={{ width: `${100 - leftWidth}%` }}>
//                     <div className="h-full p-4">
//                         <CodeEditor
//                             // language={language === "cpp" ? "cpp" : language}
//                             // code={code}
//                             // setCode={setCode}
//                             language={language === "cpp" ? "cpp" : language}
//                             code={
//                                 language === "javascript"
//                                     ? sanitizeJavaScriptCode(code, problem)
//                                     : code
//                             }
//                             setCode={setCode}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SolveProblem;





// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import CodeEditor from "../components/CodeEditor";
// import CompetitionTimer from "../components/CompetitionTimer";
// import api from "../services/api";

// const LANG_META = {
//     python: { label: "Python", color: "text-yellow-300", dot: "bg-yellow-400" },
//     cpp: { label: "C++", color: "text-pink-300", dot: "bg-pink-400" },
//     java: { label: "Java", color: "text-orange-300", dot: "bg-orange-400" },
//     javascript: { label: "JavaScript", color: "text-cyan-300", dot: "bg-cyan-400" },
// };

// const DIFFICULTY_META = {
//     easy: { dot: "bg-green-400", ring: "ring-green-500/30", bg: "bg-green-500/10", border: "border-green-500/30" },
//     medium: { dot: "bg-yellow-400", ring: "ring-yellow-500/30", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
//     hard: { dot: "bg-red-400", ring: "ring-red-500/30", bg: "bg-red-500/10", border: "border-red-500/30" },
// };

// // --- Local draft persistence (per problem + per language) -----------------
// const CODE_STORAGE_PREFIX = "codearena:code:";
// const getStorageKey = (problemId, lang) => `${CODE_STORAGE_PREFIX}${problemId}:${lang}`;

// const loadSavedCode = (problemId, lang) => {
//     try {
//         return window.localStorage.getItem(getStorageKey(problemId, lang));
//     } catch {
//         return null;
//     }
// };

// const saveCodeDraft = (problemId, lang, code) => {
//     try {
//         if (code && code.trim().length > 0) {
//             window.localStorage.setItem(getStorageKey(problemId, lang), code);
//         } else {
//             window.localStorage.removeItem(getStorageKey(problemId, lang));
//         }
//     } catch {
//         // storage might be unavailable/full — fail silently, not critical
//     }
// };

// const clearCodeDraft = (problemId, lang) => {
//     try {
//         window.localStorage.removeItem(getStorageKey(problemId, lang));
//     } catch {
//         // ignore
//     }
// };
// // ---------------------------------------------------------------------------

// const SolveProblem = () => {
//     const { problemId } = useParams(); // ✅ FROM URL

//     const [problem, setProblem] = useState(null);
//     const [testCases, setTestCases] = useState([]);
//     const [language, setLanguage] = useState("python");
//     const [code, setCode] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [submissions, setSubmissions] = useState([]);
//     const [activeTab, setActiveTab] = useState('problem');//mm
//     const [leftWidth, setLeftWidth] = useState(50); // %
//     const [isResizing, setIsResizing] = useState(false);
//     const [analysisResult, setAnalysisResult] = useState(null);
//     const [analyzing, setAnalyzing] = useState(false);

//     // UI-only, no logic impact — clipboard copy feedback
//     const [copiedKey, setCopiedKey] = useState(null);
//     const copyToClipboard = (text, key) => {
//         navigator.clipboard?.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
//         setCopiedKey(key);
//         setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
//     };

//     // Draft persistence UI state (purely informational, no effect on API calls)
//     const [draftRestored, setDraftRestored] = useState(false);
//     const [savedFlash, setSavedFlash] = useState(false);

//     const fetchProblemDetails = useCallback(async () => {
//         try {
//             // Get problem details
//             const problemRes = await api.get(`/problems/${problemId}`);
//             setProblem(problemRes.data.problem);

//             // Set default code template based on language from starter templates
//             const starterCode = problemRes.data.problem.starterTemplates?.[language] || problemRes.data.problem.starterTemplates?.python || '';

//             // Prefer a locally saved draft for this problem+language, if one exists
//             const saved = loadSavedCode(problemId, language);
//             if (saved !== null && saved !== undefined && saved !== "") {
//                 setCode(saved);
//                 setDraftRestored(true);
//             } else {
//                 setCode(starterCode);
//                 setDraftRestored(false);
//             }

//             // Get test cases for this problem (only visible ones)
//             const testCasesRes = await api.get(`/problems/${problemId}/testcases`);
//             setTestCases(testCasesRes.data.testCases || []);

//         } catch (error) {
//             console.error("Error fetching problem details:", error);
//         }
//     }, [problemId, language]);

//     useEffect(() => {
//         fetchProblemDetails();
//     }, [fetchProblemDetails]);
//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             if (!isResizing) return;

//             const newWidth = (e.clientX / window.innerWidth) * 100;
//             if (newWidth > 20 && newWidth < 70) {
//                 setLeftWidth(newWidth);
//             }
//         };

//         const handleMouseUp = () => {
//             setIsResizing(false);
//         };

//         window.addEventListener("mousemove", handleMouseMove);
//         window.addEventListener("mouseup", handleMouseUp);

//         return () => {
//             window.removeEventListener("mousemove", handleMouseMove);
//             window.removeEventListener("mouseup", handleMouseUp);
//         };
//     }, [isResizing]);

//     // Debounced auto-save of the current draft to localStorage, per problem + language
//     useEffect(() => {
//         if (!problemId || !language) return;
//         const t = setTimeout(() => {
//             saveCodeDraft(problemId, language, code);
//             setSavedFlash(true);
//             const hide = setTimeout(() => setSavedFlash(false), 1200);
//             return () => clearTimeout(hide);
//         }, 400);
//         return () => clearTimeout(t);
//     }, [code, problemId, language]);


//     const runCode = async () => {
//         try {
//             setLoading(true);
//             setMessage("");

//             const response = await api.post(`/problems/${problemId}/run`, {
//                 language,
//                 code
//             });

//             const { passed, total, error } = response.data;
//             if (error) {
//                 setMessage(`❌ Runtime Error: ${error}`);
//             } else {
//                 setMessage(`✅ Run completed! Passed ${passed}/${total} test cases`);
//             }

//         } catch (error) {
//             setMessage(`❌ Run failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const submitCode = async () => {
//         try {
//             setLoading(true);
//             setMessage("");

//             await api.post(`/problems/${problemId}/submit`, {
//                 language,
//                 code
//             });

//             setMessage("✅ Code submitted successfully!");

//             // Optionally fetch recent submissions to show results
//             const submissionsRes = await api.get('/my-submissions');
//             setSubmissions(submissionsRes.data.submissions || []);

//         } catch (error) {
//             setMessage(`❌ Submission failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const analyzeCode = async () => {
//         try {
//             setAnalyzing(true);
//             setAnalysisResult(null);

//             const response = await api.post('/ai/analyze-complexity', {
//                 language,
//                 code
//             });

//             if (response.data.success) {
//                 setAnalysisResult(response.data.result);
//             } else {
//                 setMessage(`❌ Analysis failed: ${response.data.message}`);
//             }

//         } catch (error) {
//             setMessage(`❌ Analysis failed: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setAnalyzing(false);
//         }
//     };



//     const getDifficultyColor = (difficulty) => {
//         switch (difficulty) {
//             case 'easy': return 'text-green-500';
//             case 'medium': return 'text-yellow-500';
//             case 'hard': return 'text-red-500';
//             default: return 'text-gray-500';
//         }
//     };

//     const sanitizeJavaScriptCode = (code, problem) => {
//         if (!problem) return code;

//         // If function already has JS-style signature, do nothing
//         if (/function\s+\w+\s*\(.*\)/.test(code)) {
//             return code.replace(/\b(number|string|boolean)\s+/g, '');
//         }

//         // Build JS-style function signature
//         const params = problem.parameters?.map(p => p.name).join(', ') || '';

//         return `function ${problem.functionName}(${params}) {
//     // write your code here
// }
// `;
//     };

//     // Discards the local draft for the current language and reloads the starter template.
//     // Only clears localStorage — does not call any API.
//     const resetToStarterTemplate = () => {
//         if (!problem) return;
//         const starterCode = problem.starterTemplates?.[language] || problem.starterTemplates?.python || '';
//         clearCodeDraft(problemId, language);
//         setCode(starterCode);
//         setDraftRestored(false);
//     };

//     const diffMeta = DIFFICULTY_META[problem?.difficulty] || { dot: "bg-gray-400", ring: "ring-gray-500/30", bg: "bg-gray-500/10", border: "border-gray-500/30" };
//     const langMeta = LANG_META[language] || LANG_META.python;

//     if (!problem) {
//         return (
//             <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative overflow-hidden">
//                 <style>{`
//                     @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
//                     .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.08) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 14s linear infinite; }
//                     .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
//                 `}</style>
//                 <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
//                 <div className="relative z-10 flex flex-col items-center gap-4">
//                     <div className="relative w-14 h-14">
//                         <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-lg opacity-40 animate-pulse" />
//                         <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-mono-ui text-white font-bold text-xl shadow-lg animate-spin" style={{ animationDuration: '2s' }}>
//                             {'</>'}
//                         </div>
//                     </div>
//                     <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Loading problem<span className="anim-blink">...</span></p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#0A0D14]">
//             <style>{`
//                 @keyframes fadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 @keyframes blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
//                 @keyframes popIn { 0% { opacity: 0; transform: scale(.9); } 100% { opacity: 1; transform: scale(1); } }
//                 .anim-fade-up { animation: fadeUp .35s cubic-bezier(.16,1,.3,1) both; }
//                 .anim-fade-in { animation: fadeIn .3s ease both; }
//                 .anim-blink { animation: blink 1.1s step-end infinite; }
//                 .anim-pop { animation: popIn .25s cubic-bezier(.34,1.56,.64,1) both; }
//                 .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
//                 .no-scrollbar::-webkit-scrollbar { display: none; }
//                 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//                 .tab-underline { position: relative; }
//                 .tab-underline::after { content: ""; position: absolute; left: 8%; right: 8%; bottom: 0; height: 2px; border-radius: 2px; background: linear-gradient(90deg,#7c5cff,#22d3ee); transform: scaleX(0); transition: transform .25s ease; }
//                 .tab-underline.active::after { transform: scaleX(1); }
//                 @media (prefers-reduced-motion: reduce) {
//                     .anim-fade-up, .anim-fade-in, .anim-blink, .anim-pop { animation: none !important; }
//                 }
//             `}</style>

//             {/* Header */}
//             <div className="bg-[#0F131C] border-b border-white/5 px-6 py-4 relative">
//                 <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-60" />
//                 <div className="max-w-7xl mx-auto">
//                     {/* Title Row */}
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-mono-ui text-[11px] text-gray-500">$ problem</span>
//                             </div>
//                             <h1 className="text-2xl font-bold text-white tracking-tight">{problem.title}</h1>
//                             <div className="flex items-center gap-3 mt-2.5 flex-wrap">
//                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${diffMeta.bg} ${diffMeta.border} ${getDifficultyColor(problem.difficulty)} capitalize`}>
//                                     <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
//                                     {problem.difficulty}
//                                 </span>
//                                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
//                                     <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
//                                     <span className="text-white font-semibold">{problem.marksPerTestCase}</span> pts / test
//                                 </span>
//                             </div>
//                         </div>
//                         {problem.competition && (
//                             <div className="rounded-lg bg-white/5 border border-white/10 px-1">
//                                 <CompetitionTimer
//                                     startTime={problem.competition.startTime}
//                                     endTime={problem.competition.endTime}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Controls Row */}
//                     <div className="flex flex-wrap items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                             <div className="relative">
//                                 <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${langMeta.dot}`} />
//                                 <select
//                                     value={language}
//                                     onChange={(e) => {
//                                         const newLang = e.target.value;
//                                         setLanguage(newLang);
//                                         // Use the proper starter template for the selected language,
//                                         // unless a local draft already exists for it
//                                         const starterCode = problem.starterTemplates?.[newLang] || problem.starterTemplates?.python || '';
//                                         const saved = loadSavedCode(problemId, newLang);
//                                         if (saved !== null && saved !== undefined && saved !== "") {
//                                             setCode(saved);
//                                             setDraftRestored(true);
//                                         } else {
//                                             setCode(starterCode);
//                                             setDraftRestored(false);
//                                         }
//                                     }}
//                                     className="appearance-none bg-gray-800/70 text-white pl-7 pr-8 py-2 rounded-lg border border-white/10 text-sm font-medium outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
//                                 >
//                                     <option value="python">Python</option>
//                                     <option value="cpp">C++</option>
//                                     <option value="java">Java</option>
//                                     <option value="javascript">JavaScript</option>
//                                 </select>
//                                 <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={runCode}
//                                 disabled={loading}
//                                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-semibold transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-green-900/30"
//                             >
//                                 {loading ? (
//                                     <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
//                                 ) : (
//                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//                                 )}
//                                 {loading ? "Running..." : "Run Code"}
//                             </button>
//                             <button
//                                 //onClick={submitCode}
//                                 onClick={() => {
//                                     submitCode()
//                                     setActiveTab('submissions')
//                                 }}
//                                 disabled={loading}
//                                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-semibold transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-indigo-900/30"
//                             >
//                                 {loading ? (
//                                     <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
//                                 ) : (
//                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                                 )}
//                                 {loading ? "Submitting..." : "Submit Code"}
//                             </button>
//                             {/* <button
//                                 onClick={analyzeCode}
//                                 disabled={analyzing}
//                                 className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
//                             >
//                                 {analyzing ? "Analyzing..." : "Analyze Complexity"}
//                             </button> */}
//                         </div>
//                     </div>
//                 </div>
//                 {message && (
//                     <div className="max-w-7xl mx-auto mt-4 anim-fade-up">
//                         <div className={`flex items-center gap-2.5 justify-center text-center p-3 rounded-lg w-fit mx-auto text-sm font-medium border ${message.includes('✅') ? 'bg-green-900/20 text-green-300 border-green-700/50' : 'bg-red-900/20 text-red-300 border-red-700/50'}`}>
//                             {message.includes('✅') ? (
//                                 <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                             ) : (
//                                 <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
//                             )}
//                             {message.replace('✅ ', '').replace('❌ ', '')}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Main Content */}
//             <div className="flex h-[calc(100vh-80px)]">
//                 {/* Left Panel - Tabs */}
//                 <div className="flex flex-col min-h-0"
//                     style={{ width: `${leftWidth}%` }}>
//                     {/* Tabs */}
//                     <div className="flex border-b border-white/5 bg-[#0F131C]">
//                         <button
//                             onClick={() => setActiveTab('problem')}
//                             className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'problem' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
//                                 }`}
//                         >
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-3.75L12 17.25m4.5-9.75h-3m1.5 0V3.104" /></svg>
//                             Problem
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('submissions')}
//                             className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'submissions' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
//                                 }`}
//                         >
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
//                             Submissions
//                             {submissions.filter(s => s.problem._id === problemId).length > 0 && (
//                                 <span className="ml-1 text-[10px] bg-white/10 rounded-full px-1.5 py-0.5 text-gray-300">{submissions.filter(s => s.problem._id === problemId).length}</span>
//                             )}
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('analysis')}
//                             className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
//                                 }`}
//                         >
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
//                             Analysis
//                         </button>
//                     </div>

//                     {/* Tab Content */}
//                     <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
//                         {activeTab === 'problem' ? (
//                             <div className="p-6 anim-fade-in">
//                                 {/* Problem Description */}
//                                 <div className="mb-6">
//                                     <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
//                                         <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
//                                         Description
//                                     </h2>
//                                     <p className="text-gray-300 leading-relaxed text-[15px]">{problem.description}</p>
//                                 </div>

//                                 {/* Constraints */}
//                                 {problem.constraints && (
//                                     <div className="mb-6">
//                                         <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
//                                             <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                             Constraints
//                                         </h3>
//                                         <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono-ui">
//                                             <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.constraints}</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Sample Test Cases */}
//                                 <div className="mb-6">
//                                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                                         <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
//                                         Sample Test Cases
//                                     </h3>
//                                     {testCases.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {testCases.map((testCase, index) => (
//                                                 <div key={index} className="bg-[#12161f] rounded-xl border border-white/10 overflow-hidden shadow-lg">
//                                                     <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
//                                                         <span className="text-xs font-mono-ui text-gray-400">Test Case #{index + 1}</span>
//                                                     </div>
//                                                     <div className="grid grid-cols-1 gap-4 p-4">
//                                                         <div>
//                                                             <div className="flex items-center justify-between mb-2">
//                                                                 <h4 className="font-medium text-gray-400 text-xs uppercase tracking-wide">Input</h4>
//                                                                 <button
//                                                                     onClick={() => copyToClipboard(testCase.input, `in-${index}`)}
//                                                                     className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors flex items-center gap-1"
//                                                                 >
//                                                                     {copiedKey === `in-${index}` ? (
//                                                                         <>
//                                                                             <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                                                                             Copied
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
//                                                                             Copy
//                                                                         </>
//                                                                     )}
//                                                                 </button>
//                                                             </div>
//                                                             <pre className="bg-black/40 p-3 rounded-lg text-sm text-indigo-300 font-mono-ui whitespace-pre-wrap border border-white/5 overflow-x-auto">
//                                                                 {JSON.stringify(testCase.input, null, 2)}
//                                                             </pre>
//                                                         </div>
//                                                         <div>
//                                                             <div className="flex items-center justify-between mb-2">
//                                                                 <h4 className="font-medium text-gray-400 text-xs uppercase tracking-wide">Expected Output</h4>
//                                                                 <button
//                                                                     onClick={() => copyToClipboard(testCase.expectedOutput, `out-${index}`)}
//                                                                     className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
//                                                                 >
//                                                                     {copiedKey === `out-${index}` ? (
//                                                                         <>
//                                                                             <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                                                                             Copied
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
//                                                                             Copy
//                                                                         </>
//                                                                     )}
//                                                                 </button>
//                                                             </div>
//                                                             <pre className="bg-black/40 p-3 rounded-lg text-sm text-green-300 font-mono-ui whitespace-pre-wrap border border-white/5 overflow-x-auto">
//                                                                 {JSON.stringify(testCase.expectedOutput, null, 2)}
//                                                             </pre>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
//                                             <p className="text-gray-500 text-sm">No sample test cases available</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : activeTab === 'submissions' ? (
//                             <div className="h-full bg-transparent anim-fade-in">
//                                 {/* Submission History */}
//                                 <div className="h-full overflow-y-auto no-scrollbar">
//                                     {submissions.length > 0 ? (
//                                         <div className="h-full overflow-y-auto no-scrollbar">
//                                             {submissions
//                                                 .filter(sub => sub.problem._id === problemId)
//                                                 .slice(0, 10)
//                                                 .map((submission, index) => {
//                                                     const isLatest = index === 0; // Most recent submission
//                                                     const accepted = submission.status === 'accepted';
//                                                     return (
//                                                         <div
//                                                             key={submission._id}
//                                                             className={`anim-pop mx-4 my-3 rounded-xl border transition-colors ${accepted ? 'bg-green-950/20 border-green-800/30 hover:border-green-700/50' : 'bg-red-950/20 border-red-800/30 hover:border-red-700/50'
//                                                                 }`}
//                                                         >
//                                                             <div className="px-4 py-3">
//                                                                 {/* Header Row */}
//                                                                 <div className="flex items-center justify-between mb-2">
//                                                                     <div className="flex items-center gap-2 flex-wrap">
//                                                                         <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${accepted
//                                                                             ? 'bg-green-900/60 text-green-300 border border-green-700'
//                                                                             : 'bg-red-900/60 text-red-300 border border-red-700'
//                                                                             }`}>
//                                                                             {accepted ? (
//                                                                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                                                                             ) : (
//                                                                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
//                                                                             )}
//                                                                             {submission.status}
//                                                                         </span>
//                                                                         <span className="inline-flex items-center gap-1 text-gray-400 text-xs bg-white/5 px-2 py-1 rounded-full">
//                                                                             {submission.language}
//                                                                         </span>
//                                                                         {isLatest && (
//                                                                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
//                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//                                                                                 Latest
//                                                                             </span>
//                                                                         )}
//                                                                     </div>
//                                                                     <span className="text-gray-500 text-xs whitespace-nowrap">
//                                                                         {new Date(submission.createdAt).toLocaleString()}
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* Score */}
//                                                                 <div className="flex items-center gap-1.5 mb-1">
//                                                                     <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
//                                                                     <span className="text-white text-sm font-medium">
//                                                                         Score: <span className="text-indigo-400 font-bold">{submission.score}</span>
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* Error Display - Only for latest submission */}
//                                                                 {submission.error && isLatest && (
//                                                                     <div className="mt-2 bg-red-950/40 border border-red-800/50 rounded-lg overflow-hidden">
//                                                                         <div className="px-3 py-2 bg-red-900/30 border-b border-red-800/50">
//                                                                             <div className="flex items-center gap-2">
//                                                                                 <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
//                                                                                 <span className="text-red-400 text-xs font-medium">Runtime Error</span>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="p-3">
//                                                                             <div className="bg-red-900/20 border border-red-800/30 rounded-lg text-xs font-mono-ui text-red-300 p-2 max-h-24 overflow-y-auto overflow-x-auto no-scrollbar whitespace-pre-wrap break-words">
//                                                                                 {submission.error}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     );
//                                                 })
//                                             }
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center justify-center h-full">
//                                             <div className="text-center">
//                                                 <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
//                                                 <div className="text-gray-500 text-sm mb-1">No submissions yet</div>
//                                                 <div className="text-gray-600 text-xs">Submit your code to see results here</div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : activeTab === 'analysis' ? (
//                             <div className="h-full p-6 anim-fade-in">
//                                 {analysisResult ? (
//                                     <div className="max-w-4xl mx-auto">
//                                         <div className="flex items-center justify-between mb-6">
//                                             <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                                                 <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
//                                                 Code Analysis
//                                             </h3>
//                                             <button
//                                                 onClick={analyzeCode}
//                                                 disabled={analyzing}
//                                                 className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all active:scale-95"
//                                             >
//                                                 {analyzing && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
//                                                 {analyzing ? "Analyzing..." : "Re-analyze"}
//                                             </button>
//                                         </div>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div className="bg-[#12161f] p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
//                                                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
//                                                 <div className="relative text-purple-300 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
//                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                                     Time Complexity
//                                                 </div>
//                                                 <div className="relative text-white text-3xl font-bold font-mono-ui">{analysisResult.time_complexity}</div>
//                                             </div>
//                                             <div className="bg-[#12161f] p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
//                                                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
//                                                 <div className="relative text-purple-300 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
//                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5-4.5v.75a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-.75" /></svg>
//                                                     Space Complexity
//                                                 </div>
//                                                 <div className="relative text-white text-3xl font-bold font-mono-ui">{analysisResult.space_complexity}</div>
//                                             </div>
//                                             <div className="bg-[#12161f] p-6 rounded-xl border border-white/10 md:col-span-2">
//                                                 <div className="text-purple-300 text-xs font-semibold uppercase tracking-wide mb-3">Explanation</div>
//                                                 <div className="text-gray-300 text-[15px] leading-relaxed">{analysisResult.explanation}</div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center justify-center h-full">
//                                         <div className="text-center">
//                                             <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
//                                             <div className="text-gray-400 text-lg mb-2">No analysis yet</div>
//                                             <div className="text-gray-600 text-sm mb-5">Click below to get an AI-powered breakdown of your code's complexity</div>
//                                             <button
//                                                 onClick={analyzeCode}
//                                                 disabled={analyzing}
//                                                 className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-white font-semibold transition-all active:scale-95 shadow-lg shadow-purple-900/30"
//                                             >
//                                                 {analyzing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
//                                                 {analyzing ? "Analyzing..." : "Analyze Complexity"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : activeTab === 'code' ? (
//                             <div className="p-6 anim-fade-in">
//                                 {/* Function Signature */}
//                                 <div className="mb-6">
//                                     <h3 className="text-lg font-bold text-white mb-4">Function Signature</h3>
//                                     <div className="bg-black/30 p-4 rounded-lg border border-white/5">
//                                         <code className="text-indigo-400 font-mono-ui text-sm">
//                                             {problem.returnType} {problem.functionName}({problem.parameters?.map((param, idx) =>
//                                                 `${param.type} ${param.name}${idx < (problem.parameters?.length || 0) - 1 ? ', ' : ''}`
//                                             ).join('') || ''})
//                                         </code>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : null}
//                     </div>
//                 </div>

//                 <div
//                     onMouseDown={() => setIsResizing(true)}
//                     className="w-1.5 cursor-col-resize bg-white/5 hover:bg-violet-500/60 transition-colors relative group"
//                     style={{ userSelect: "none" }}
//                 >
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-violet-300 transition-colors" />
//                 </div>

//                 {/* Right Panel - Code Editor */}
//                 <div className="border-l border-white/5 flex flex-col"
//                     style={{ width: `${100 - leftWidth}%` }}>
//                     <div className="flex items-center gap-2 px-4 py-2 bg-[#0F131C] border-b border-white/5">
//                         <span className={`w-2 h-2 rounded-full ${langMeta.dot}`} />
//                         <span className={`text-xs font-mono-ui font-medium ${langMeta.color}`}>{langMeta.label}</span>

//                         {draftRestored && (
//                             <span className="anim-fade-in inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
//                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
//                                 Draft restored
//                             </span>
//                         )}

//                         <span className={`text-[11px] text-gray-500 flex items-center gap-1 transition-opacity duration-300 ${savedFlash ? 'opacity-100' : 'opacity-0'}`}>
//                             <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                             Saved
//                         </span>

//                         <button
//                             onClick={resetToStarterTemplate}
//                             title="Discard local draft and reload the starter template"
//                             className="ml-auto text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
//                         >
//                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
//                             Reset
//                         </button>
//                     </div>
//                     <div className="flex-1 p-4 min-h-0">
//                         <CodeEditor
//                             // language={language === "cpp" ? "cpp" : language}
//                             // code={code}
//                             // setCode={setCode}
//                             language={language === "cpp" ? "cpp" : language}
//                             code={
//                                 language === "javascript"
//                                     ? sanitizeJavaScriptCode(code, problem)
//                                     : code
//                             }
//                             setCode={setCode}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SolveProblem;



import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import CompetitionTimer from "../components/CompetitionTimer";
import api from "../services/api";

const LANG_META = {
    python: { label: "Python", color: "text-yellow-300", dot: "bg-yellow-400" },
    cpp: { label: "C++", color: "text-pink-300", dot: "bg-pink-400" },
    java: { label: "Java", color: "text-orange-300", dot: "bg-orange-400" },
    javascript: { label: "JavaScript", color: "text-cyan-300", dot: "bg-cyan-400" },
};

const DIFFICULTY_META = {
    easy: { dot: "bg-green-400", ring: "ring-green-500/30", bg: "bg-green-500/10", border: "border-green-500/30" },
    medium: { dot: "bg-yellow-400", ring: "ring-yellow-500/30", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    hard: { dot: "bg-red-400", ring: "ring-red-500/30", bg: "bg-red-500/10", border: "border-red-500/30" },
};

// --- Local draft persistence (per problem + per language) -----------------
const CODE_STORAGE_PREFIX = "codearena:code:";
const getStorageKey = (problemId, lang) => `${CODE_STORAGE_PREFIX}${problemId}:${lang}`;

const loadSavedCode = (problemId, lang) => {
    try {
        return window.localStorage.getItem(getStorageKey(problemId, lang));
    } catch {
        return null;
    }
};

const saveCodeDraft = (problemId, lang, code) => {
    try {
        if (code && code.trim().length > 0) {
            window.localStorage.setItem(getStorageKey(problemId, lang), code);
        } else {
            window.localStorage.removeItem(getStorageKey(problemId, lang));
        }
    } catch {
        // storage might be unavailable/full — fail silently, not critical
    }
};

const clearCodeDraft = (problemId, lang) => {
    try {
        window.localStorage.removeItem(getStorageKey(problemId, lang));
    } catch {
        // ignore
    }
};
// ---------------------------------------------------------------------------

// --- Submission polling helpers --------------------------------------------
// Backend now processes submissions through an in-memory queue (concurrency
// 1) to avoid overloading the EC2 instance during contests. submitCode no
// longer gets the final verdict synchronously — it gets a submissionId back
// almost instantly with status "queued", and we poll GET /submission/:id
// until the verdict ("accepted"/"rejected") is ready.
const POLL_INTERVAL_MS = 1500;

// queuePosition: number of jobs ahead of this one (0 = up next), or
// null/undefined if not tracked (job already started/finished).
const statusMessage = (submission, queuePosition) => {
    switch (submission.status) {
        case "queued": {
            if (queuePosition !== null && queuePosition !== undefined) {
                return queuePosition === 0
                    ? "⏳ Queued for evaluation... you're next!"
                    : `⏳ Queued for evaluation... ${queuePosition} submission${queuePosition === 1 ? '' : 's'} ahead of you`;
            }
            return "⏳ Queued for evaluation... waiting for the judge";
        }
        case "processing":
            return "⏳ Running your code against test cases...";
        case "accepted":
            return `✅ Accepted! Score: ${submission.score}`;
        case "rejected":
            return `❌ Rejected. Score: ${submission.score}${submission.error ? ` — ${submission.error}` : ""}`;
        default:
            return `Status: ${submission.status}`;
    }
};
// ---------------------------------------------------------------------------

const SolveProblem = () => {
    const { problemId } = useParams(); // ✅ FROM URL

    const [problem, setProblem] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState('problem');//mm
    const [leftWidth, setLeftWidth] = useState(50); // %
    const [isResizing, setIsResizing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // UI-only, no logic impact — clipboard copy feedback
    const [copiedKey, setCopiedKey] = useState(null);
    const copyToClipboard = (text, key) => {
        navigator.clipboard?.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
        setCopiedKey(key);
        setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    };

    // Draft persistence UI state (purely informational, no effect on API calls)
    const [draftRestored, setDraftRestored] = useState(false);
    const [savedFlash, setSavedFlash] = useState(false);

    // Tracks the active polling interval for a submission, so we can clear
    // it if the component unmounts or a new submission starts mid-poll.
    const pollIntervalRef = useRef(null);

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    // Make sure we never leave a polling interval running after navigating away.
    useEffect(() => {
        return () => stopPolling();
    }, []);

    const fetchProblemDetails = useCallback(async () => {
        try {
            // Get problem details
            const problemRes = await api.get(`/problems/${problemId}`);
            setProblem(problemRes.data.problem);

            // Set default code template based on language from starter templates
            const starterCode = problemRes.data.problem.starterTemplates?.[language] || problemRes.data.problem.starterTemplates?.python || '';

            // Prefer a locally saved draft for this problem+language, if one exists
            const saved = loadSavedCode(problemId, language);
            if (saved !== null && saved !== undefined && saved !== "") {
                setCode(saved);
                setDraftRestored(true);
            } else {
                setCode(starterCode);
                setDraftRestored(false);
            }

            // Get test cases for this problem (only visible ones)
            const testCasesRes = await api.get(`/problems/${problemId}/testcases`);
            setTestCases(testCasesRes.data.testCases || []);

        } catch (error) {
            console.error("Error fetching problem details:", error);
        }
    }, [problemId, language]);

    useEffect(() => {
        fetchProblemDetails();
    }, [fetchProblemDetails]);
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;

            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 70) {
                setLeftWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    // Debounced auto-save of the current draft to localStorage, per problem + language
    useEffect(() => {
        if (!problemId || !language) return;
        const t = setTimeout(() => {
            saveCodeDraft(problemId, language, code);
            setSavedFlash(true);
            const hide = setTimeout(() => setSavedFlash(false), 1200);
            return () => clearTimeout(hide);
        }, 400);
        return () => clearTimeout(t);
    }, [code, problemId, language]);


    const runCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(`/problems/${problemId}/run`, {
                language,
                code
            });

            const { passed, total, error } = response.data;
            if (error) {
                setMessage(`❌ Runtime Error: ${error}`);
            } else {
                setMessage(`✅ Run completed! Passed ${passed}/${total} test cases`);
            }

        } catch (error) {
            setMessage(`❌ Run failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Polls GET /submission/:id every POLL_INTERVAL_MS until the submission
    // reaches a final state (accepted/rejected), updating `message` as it goes.
    const pollSubmissionStatus = (submissionId) => {
        stopPolling(); // guard against overlapping intervals

        pollIntervalRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/submission/${submissionId}`);
                const submission = res.data.submission;
                const queuePosition = res.data.queuePosition;

                setMessage(statusMessage(submission, queuePosition));

                const isFinal = submission.status === "accepted" || submission.status === "rejected";
                if (isFinal) {
                    stopPolling();
                    setLoading(false);

                    // Refresh submission history now that a final verdict is in
                    try {
                        const submissionsRes = await api.get('/my-submissions');
                        setSubmissions(submissionsRes.data.submissions || []);
                    } catch (err) {
                        console.error("Error refreshing submissions:", err);
                    }
                }
            } catch (error) {
                // If polling itself fails (network blip, etc.), stop rather than
                // spamming errors forever — the submission is still safely
                // processing server-side either way.
                console.error("Error polling submission status:", error);
                stopPolling();
                setLoading(false);
                setMessage(`❌ Could not fetch submission status: ${error.response?.data?.message || error.message}`);
            }
        }, POLL_INTERVAL_MS);
    };

    const submitCode = async () => {
        try {
            setLoading(true);
            setMessage("⏳ Submitting...");
            stopPolling(); // in case a previous poll is somehow still running

            const response = await api.post(`/problems/${problemId}/submit`, {
                language,
                code
            });

            const { submissionId } = response.data;

            setMessage("⏳ Submitted! Queued for evaluation...");

            if (submissionId) {
                pollSubmissionStatus(submissionId);
            } else {
                // Shouldn't happen, but don't leave the button stuck on "Submitting..."
                setLoading(false);
            }

        } catch (error) {
            // Backend returns 409 when this user already has a submission for
            // this problem still queued/processing — show that message as-is,
            // and if it included the existing submissionId, poll that one too
            // so the button naturally recovers instead of staying stuck.
            const data = error.response?.data;
            setMessage(`❌ Submission failed: ${data?.message || error.message}`);

            if (error.response?.status === 409 && data?.submissionId) {
                pollSubmissionStatus(data.submissionId);
            } else {
                setLoading(false);
            }
        }
    };

    const analyzeCode = async () => {
        try {
            setAnalyzing(true);
            setAnalysisResult(null);

            const response = await api.post('/ai/analyze-complexity', {
                language,
                code
            });

            if (response.data.success) {
                setAnalysisResult(response.data.result);
            } else {
                setMessage(`❌ Analysis failed: ${response.data.message}`);
            }

        } catch (error) {
            setMessage(`❌ Analysis failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setAnalyzing(false);
        }
    };



    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const sanitizeJavaScriptCode = (code, problem) => {
        if (!problem) return code;

        // If function already has JS-style signature, do nothing
        if (/function\s+\w+\s*\(.*\)/.test(code)) {
            return code.replace(/\b(number|string|boolean)\s+/g, '');
        }

        // Build JS-style function signature
        const params = problem.parameters?.map(p => p.name).join(', ') || '';

        return `function ${problem.functionName}(${params}) {
    // write your code here
}
`;
    };

    // Discards the local draft for the current language and reloads the starter template.
    // Only clears localStorage — does not call any API.
    const resetToStarterTemplate = () => {
        if (!problem) return;
        const starterCode = problem.starterTemplates?.[language] || problem.starterTemplates?.python || '';
        clearCodeDraft(problemId, language);
        setCode(starterCode);
        setDraftRestored(false);
    };

    const diffMeta = DIFFICULTY_META[problem?.difficulty] || { dot: "bg-gray-400", ring: "ring-gray-500/30", bg: "bg-gray-500/10", border: "border-gray-500/30" };
    const langMeta = LANG_META[language] || LANG_META.python;

    if (!problem) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative overflow-hidden">
                <style>{`
                    @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                    .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.08) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 14s linear infinite; }
                    .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                `}</style>
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-lg opacity-40 animate-pulse" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-mono-ui text-white font-bold text-xl shadow-lg animate-spin" style={{ animationDuration: '2s' }}>
                            {'</>'}
                        </div>
                    </div>
                    <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Loading problem<span className="anim-blink">...</span></p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0D14]">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes popIn { 0% { opacity: 0; transform: scale(.9); } 100% { opacity: 1; transform: scale(1); } }
                .anim-fade-up { animation: fadeUp .35s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .3s ease both; }
                .anim-blink { animation: blink 1.1s step-end infinite; }
                .anim-pop { animation: popIn .25s cubic-bezier(.34,1.56,.64,1) both; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .tab-underline { position: relative; }
                .tab-underline::after { content: ""; position: absolute; left: 8%; right: 8%; bottom: 0; height: 2px; border-radius: 2px; background: linear-gradient(90deg,#7c5cff,#22d3ee); transform: scaleX(0); transition: transform .25s ease; }
                .tab-underline.active::after { transform: scaleX(1); }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-blink, .anim-pop { animation: none !important; }
                }
            `}</style>

            {/* Header */}
            <div className="bg-[#0F131C] border-b border-white/5 px-6 py-4 relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-60" />
                <div className="max-w-7xl mx-auto">
                    {/* Title Row */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono-ui text-[11px] text-gray-500">$ problem</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{problem.title}</h1>
                            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${diffMeta.bg} ${diffMeta.border} ${getDifficultyColor(problem.difficulty)} capitalize`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                                    {problem.difficulty}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                    <span className="text-white font-semibold">{problem.marksPerTestCase}</span> pts / test
                                </span>
                            </div>
                        </div>
                        {problem.competition && (
                            <div className="rounded-lg bg-white/5 border border-white/10 px-1">
                                <CompetitionTimer
                                    startTime={problem.competition.startTime}
                                    endTime={problem.competition.endTime}
                                />
                            </div>
                        )}
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${langMeta.dot}`} />
                                <select
                                    value={language}
                                    onChange={(e) => {
                                        const newLang = e.target.value;
                                        setLanguage(newLang);
                                        // Use the proper starter template for the selected language,
                                        // unless a local draft already exists for it
                                        const starterCode = problem.starterTemplates?.[newLang] || problem.starterTemplates?.python || '';
                                        const saved = loadSavedCode(problemId, newLang);
                                        if (saved !== null && saved !== undefined && saved !== "") {
                                            setCode(saved);
                                            setDraftRestored(true);
                                        } else {
                                            setCode(starterCode);
                                            setDraftRestored(false);
                                        }
                                    }}
                                    className="appearance-none bg-gray-800/70 text-white pl-7 pr-8 py-2 rounded-lg border border-white/10 text-sm font-medium outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                                >
                                    <option value="python">Python</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="javascript">JavaScript</option>
                                </select>
                                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={runCode}
                                disabled={loading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-semibold transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-green-900/30"
                            >
                                {loading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                )}
                                {loading ? "Running..." : "Run Code"}
                            </button>
                            <button
                                //onClick={submitCode}
                                onClick={() => {
                                    submitCode()
                                    setActiveTab('submissions')
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-semibold transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-indigo-900/30"
                            >
                                {loading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                )}
                                {loading ? "Submitting..." : "Submit Code"}
                            </button>
                            {/* <button
                                onClick={analyzeCode}
                                disabled={analyzing}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
                            >
                                {analyzing ? "Analyzing..." : "Analyze Complexity"}
                            </button> */}
                        </div>
                    </div>
                </div>
                {message && (
                    <div className="max-w-7xl mx-auto mt-4 anim-fade-up">
                        <div className={`flex items-center gap-2.5 justify-center text-center p-3 rounded-lg w-fit mx-auto text-sm font-medium border ${message.includes('✅')
                                ? 'bg-green-900/20 text-green-300 border-green-700/50'
                                : message.includes('⏳')
                                    ? 'bg-indigo-900/20 text-indigo-300 border-indigo-700/50'
                                    : 'bg-red-900/20 text-red-300 border-red-700/50'
                            }`}>
                            {message.includes('✅') ? (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : message.includes('⏳') ? (
                                <svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                            )}
                            {message.replace('✅ ', '').replace('❌ ', '').replace('⏳ ', '')}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-80px)]">
                {/* Left Panel - Tabs */}
                <div className="flex flex-col min-h-0"
                    style={{ width: `${leftWidth}%` }}>
                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-[#0F131C]">
                        <button
                            onClick={() => setActiveTab('problem')}
                            className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'problem' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-3.75L12 17.25m4.5-9.75h-3m1.5 0V3.104" /></svg>
                            Problem
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'submissions' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                            Submissions
                            {submissions.filter(s => s.problem._id === problemId).length > 0 && (
                                <span className="ml-1 text-[10px] bg-white/10 rounded-full px-1.5 py-0.5 text-gray-300">{submissions.filter(s => s.problem._id === problemId).length}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={`tab-underline flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'active text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                            Analysis
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                        {activeTab === 'problem' ? (
                            <div className="p-6 anim-fade-in">
                                {/* Problem Description */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                        Description
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed text-[15px]">{problem.description}</p>
                                </div>

                                {/* Constraints */}
                                {problem.constraints && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Constraints
                                        </h3>
                                        <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono-ui">
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.constraints}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Sample Test Cases */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
                                        Sample Test Cases
                                    </h3>
                                    {testCases.length > 0 ? (
                                        <div className="space-y-4">
                                            {testCases.map((testCase, index) => (
                                                <div key={index} className="bg-[#12161f] rounded-xl border border-white/10 overflow-hidden shadow-lg">
                                                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                                        <span className="text-xs font-mono-ui text-gray-400">Test Case #{index + 1}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4 p-4">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium text-gray-400 text-xs uppercase tracking-wide">Input</h4>
                                                                <button
                                                                    onClick={() => copyToClipboard(testCase.input, `in-${index}`)}
                                                                    className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors flex items-center gap-1"
                                                                >
                                                                    {copiedKey === `in-${index}` ? (
                                                                        <>
                                                                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                                            Copied
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                                                                            Copy
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <pre className="bg-black/40 p-3 rounded-lg text-sm text-indigo-300 font-mono-ui whitespace-pre-wrap border border-white/5 overflow-x-auto">
                                                                {JSON.stringify(testCase.input, null, 2)}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium text-gray-400 text-xs uppercase tracking-wide">Expected Output</h4>
                                                                <button
                                                                    onClick={() => copyToClipboard(testCase.expectedOutput, `out-${index}`)}
                                                                    className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
                                                                >
                                                                    {copiedKey === `out-${index}` ? (
                                                                        <>
                                                                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                                            Copied
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                                                                            Copy
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <pre className="bg-black/40 p-3 rounded-lg text-sm text-green-300 font-mono-ui whitespace-pre-wrap border border-white/5 overflow-x-auto">
                                                                {JSON.stringify(testCase.expectedOutput, null, 2)}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                            <p className="text-gray-500 text-sm">No sample test cases available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'submissions' ? (
                            <div className="h-full bg-transparent anim-fade-in">
                                {/* Submission History */}
                                <div className="h-full overflow-y-auto no-scrollbar">
                                    {submissions.length > 0 ? (
                                        <div className="h-full overflow-y-auto no-scrollbar">
                                            {submissions
                                                .filter(sub => sub.problem._id === problemId)
                                                .slice(0, 10)
                                                .map((submission, index) => {
                                                    const isLatest = index === 0; // Most recent submission
                                                    const accepted = submission.status === 'accepted';
                                                    return (
                                                        <div
                                                            key={submission._id}
                                                            className={`anim-pop mx-4 my-3 rounded-xl border transition-colors ${accepted ? 'bg-green-950/20 border-green-800/30 hover:border-green-700/50' : 'bg-red-950/20 border-red-800/30 hover:border-red-700/50'
                                                                }`}
                                                        >
                                                            <div className="px-4 py-3">
                                                                {/* Header Row */}
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${accepted
                                                                            ? 'bg-green-900/60 text-green-300 border border-green-700'
                                                                            : 'bg-red-900/60 text-red-300 border border-red-700'
                                                                            }`}>
                                                                            {accepted ? (
                                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                                            ) : (
                                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                            )}
                                                                            {submission.status}
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs bg-white/5 px-2 py-1 rounded-full">
                                                                            {submission.language}
                                                                        </span>
                                                                        {isLatest && (
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                                                                Latest
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-gray-500 text-xs whitespace-nowrap">
                                                                        {new Date(submission.createdAt).toLocaleString()}
                                                                    </span>
                                                                </div>

                                                                {/* Score */}
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                                                    <span className="text-white text-sm font-medium">
                                                                        Score: <span className="text-indigo-400 font-bold">{submission.score}</span>
                                                                    </span>
                                                                </div>

                                                                {/* Error Display - Only for latest submission */}
                                                                {submission.error && isLatest && (
                                                                    <div className="mt-2 bg-red-950/40 border border-red-800/50 rounded-lg overflow-hidden">
                                                                        <div className="px-3 py-2 bg-red-900/30 border-b border-red-800/50">
                                                                            <div className="flex items-center gap-2">
                                                                                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                                                                <span className="text-red-400 text-xs font-medium">Runtime Error</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-3">
                                                                            <div className="bg-red-900/20 border border-red-800/30 rounded-lg text-xs font-mono-ui text-red-300 p-2 max-h-24 overflow-y-auto overflow-x-auto no-scrollbar whitespace-pre-wrap break-words">
                                                                                {submission.error}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                                <div className="text-gray-500 text-sm mb-1">No submissions yet</div>
                                                <div className="text-gray-600 text-xs">Submit your code to see results here</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'analysis' ? (
                            <div className="h-full p-6 anim-fade-in">
                                {analysisResult ? (
                                    <div className="max-w-4xl mx-auto">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                                Code Analysis
                                            </h3>
                                            <button
                                                onClick={analyzeCode}
                                                disabled={analyzing}
                                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all active:scale-95"
                                            >
                                                {analyzing && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                                {analyzing ? "Analyzing..." : "Re-analyze"}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-[#12161f] p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                                                <div className="relative text-purple-300 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Time Complexity
                                                </div>
                                                <div className="relative text-white text-3xl font-bold font-mono-ui">{analysisResult.time_complexity}</div>
                                            </div>
                                            <div className="bg-[#12161f] p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                                                <div className="relative text-purple-300 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5-4.5v.75a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-.75" /></svg>
                                                    Space Complexity
                                                </div>
                                                <div className="relative text-white text-3xl font-bold font-mono-ui">{analysisResult.space_complexity}</div>
                                            </div>
                                            <div className="bg-[#12161f] p-6 rounded-xl border border-white/10 md:col-span-2">
                                                <div className="text-purple-300 text-xs font-semibold uppercase tracking-wide mb-3">Explanation</div>
                                                <div className="text-gray-300 text-[15px] leading-relaxed">{analysisResult.explanation}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                            <div className="text-gray-400 text-lg mb-2">No analysis yet</div>
                                            <div className="text-gray-600 text-sm mb-5">Click below to get an AI-powered breakdown of your code's complexity</div>
                                            <button
                                                onClick={analyzeCode}
                                                disabled={analyzing}
                                                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-white font-semibold transition-all active:scale-95 shadow-lg shadow-purple-900/30"
                                            >
                                                {analyzing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                                {analyzing ? "Analyzing..." : "Analyze Complexity"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'code' ? (
                            <div className="p-6 anim-fade-in">
                                {/* Function Signature */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Function Signature</h3>
                                    <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                        <code className="text-indigo-400 font-mono-ui text-sm">
                                            {problem.returnType} {problem.functionName}({problem.parameters?.map((param, idx) =>
                                                `${param.type} ${param.name}${idx < (problem.parameters?.length || 0) - 1 ? ', ' : ''}`
                                            ).join('') || ''})
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div
                    onMouseDown={() => setIsResizing(true)}
                    className="w-1.5 cursor-col-resize bg-white/5 hover:bg-violet-500/60 transition-colors relative group"
                    style={{ userSelect: "none" }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-violet-300 transition-colors" />
                </div>

                {/* Right Panel - Code Editor */}
                <div className="border-l border-white/5 flex flex-col"
                    style={{ width: `${100 - leftWidth}%` }}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0F131C] border-b border-white/5">
                        <span className={`w-2 h-2 rounded-full ${langMeta.dot}`} />
                        <span className={`text-xs font-mono-ui font-medium ${langMeta.color}`}>{langMeta.label}</span>

                        {draftRestored && (
                            <span className="anim-fade-in inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                                Draft restored
                            </span>
                        )}

                        <span className={`text-[11px] text-gray-500 flex items-center gap-1 transition-opacity duration-300 ${savedFlash ? 'opacity-100' : 'opacity-0'}`}>
                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            Saved
                        </span>

                        <button
                            onClick={resetToStarterTemplate}
                            title="Discard local draft and reload the starter template"
                            className="ml-auto text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                            Reset
                        </button>
                    </div>
                    <div className="flex-1 p-4 min-h-0">
                        <CodeEditor
                            // language={language === "cpp" ? "cpp" : language}
                            // code={code}
                            // setCode={setCode}
                            language={language === "cpp" ? "cpp" : language}
                            code={
                                language === "javascript"
                                    ? sanitizeJavaScriptCode(code, problem)
                                    : code
                            }
                            setCode={setCode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolveProblem;