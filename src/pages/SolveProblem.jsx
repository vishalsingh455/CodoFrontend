
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import CompetitionTimer from "../components/CompetitionTimer";
import api from "../services/api";

const SolveProblem = () => {
    const { problemId } = useParams(); // ✅ FROM URL
    
    const [problem, setProblem] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState('editor');

    const fetchProblemDetails = useCallback(async () => {
        try {
            // Get problem details
            const problemRes = await api.get(`/problems/${problemId}`);
            setProblem(problemRes.data.problem);
            
            // Set default code template based on language
            const templates = {
                python: `# ${problemRes.data.problem.title}

# ${problemRes.data.problem.statement}

`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    // ${problemRes.data.problem.title}
    // ${problemRes.data.problem.statement}
    
    return 0;
}`,
                java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // ${problemRes.data.problem.title}
        // ${problemRes.data.problem.statement}
    }
}`,
                javascript: `// ${problemRes.data.problem.title}\n// ${problemRes.data.problem.statement}\n\n` 
            };
            setCode(templates[language] || templates.python);
            
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

    const submitCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            await api.post(`/problems/${problemId}/submit`, {
                language,
                code
            });

            setMessage("✅ Code submitted successfully!");

            // Optionally fetch recent submissions to show results
            const submissionsRes = await api.get('/my-submissions');
            setSubmissions(submissionsRes.data.submissions || []);

        } catch (error) {
            setMessage(`❌ Submission failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };


    
    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    if (!problem) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    {/* Title Row */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)} bg-gray-800`}>
                                    {problem.difficulty}
                                </span>
                                <span className="text-sm text-gray-300">
                                    Points per test case: <span className="text-white font-medium">{problem.marksPerTestCase}</span>
                                </span>
                            </div>
                        </div>
                        {problem.competition && (
                            <CompetitionTimer
                                startTime={problem.competition.startTime}
                                endTime={problem.competition.endTime}
                            />
                        )}
                        {/* Debug: Show raw competition data */}
                        {console.log('Problem competition data:', problem.competition)}
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <select
                                value={language}
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    const templates = {
                                        python: `# ${problem.title}\n\n# ${problem.statement}\n\n`,
                                        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // ${problem.title}\n    // ${problem.statement}\n    \n    return 0;\n}`,
                                        java: `public class Main {\n    public static void main(String[] args) {\n        // ${problem.title}\n        // ${problem.statement}\n    }\n}`,
                                        javascript: `// ${problem.title}\n// ${problem.statement}\n\n`
                                    };
                                    setCode(templates[e.target.value] || templates.python);
                                }}
                                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
                            >
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="javascript">JavaScript</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={submitCode}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition whitespace-nowrap"
                            >
                                {loading ? "Submitting..." : "Submit Code"}
                            </button>
                        </div>
                    </div>
                </div>
                {message && (
                    <div className="max-w-7xl mx-auto mt-4">
                        <p className={`text-center p-3 rounded w-fit mx-auto ${message.includes('✅') ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'}`}>
                            {message}
                        </p>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-80px)]">
                {/* Left Panel - Problem Details */}
                <div className="w-1/2 border-r border-gray-800 overflow-y-auto">
                    <div className="p-6">
                        {/* Problem Statement */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white mb-4">Problem Statement</h2>
                            <p className="text-gray-300 leading-relaxed">{problem.statement}</p>
                        </div>

                        {/* Input/Output Format */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-2">Input Format</h3>
                                <p className="text-gray-300 text-sm">{problem.inputFormat}</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-2">Output Format</h3>
                                <p className="text-gray-300 text-sm">{problem.outputFormat}</p>
                            </div>
                            {problem.constraints && (
                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                    <h3 className="font-semibold text-white mb-2">Constraints</h3>
                                    <p className="text-gray-300 text-sm">{problem.constraints}</p>
                                </div>
                            )}
                        </div>

                        {/* Sample Test Cases */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-4">Sample Test Cases</h3>
                            {testCases.length > 0 ? (
                                <div className="space-y-4">
                                    {testCases.map((testCase, index) => (
                                        <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-400 mb-2 text-sm">Input</h4>
                                                    <pre className="bg-gray-900 p-3 rounded text-sm text-gray-300 whitespace-pre-wrap border border-gray-700 overflow-x-auto">
                                                        {testCase.input}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-400 mb-2 text-sm">Expected Output</h4>
                                                    <pre className="bg-gray-900 p-3 rounded text-sm text-gray-300 whitespace-pre-wrap border border-gray-700 overflow-x-auto">
                                                        {testCase.expectedOutput}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-4">No sample test cases available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Tabs */}
                <div className="w-1/2 flex flex-col min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-800 bg-gray-900/50">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'editor'
                                    ? 'text-white bg-gray-800 border-b-2 border-indigo-500'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        >
                            Code Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'submissions'
                                    ? 'text-white bg-gray-800 border-b-2 border-indigo-500'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        >
                            Submissions
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 min-h-0">
                        {activeTab === 'editor' ? (
                            <div className="h-full p-4">
                                <CodeEditor
                                    language={language === "cpp" ? "cpp" : language}
                                    code={code}
                                    setCode={setCode}
                                />
                            </div>
                        ) : (
                            <div className="h-full bg-gray-900/30">
                                {/* Submission History */}
                                <div className="h-full overflow-hidden">
                                    {submissions.length > 0 ? (
                                        <div className="h-full overflow-y-auto">
                                            {submissions
                                                .filter(sub => sub.problem._id === problemId)
                                                .slice(0, 10)
                                                .map((submission, index) => {
                                                    const isLatest = index === 0; // Most recent submission
                                                    return (
                                                        <div
                                                            key={submission._id}
                                                            className={`px-4 py-3 border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors ${
                                                                index === 0 ? 'border-t-0' : ''
                                                            }`}
                                                        >
                                                            {/* Header Row */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        submission.status === 'accepted'
                                                                            ? 'bg-green-900/60 text-green-300 border border-green-700'
                                                                            : 'bg-red-900/60 text-red-300 border border-red-700'
                                                                    }`}>
                                                                        {submission.status === 'accepted' ? '✓' : '✗'} {submission.status}
                                                                    </span>
                                                                    <span className="text-gray-400 text-xs">
                                                                        {submission.language}
                                                                    </span>
                                                                    {isLatest && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                                                                            Latest
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-gray-500 text-xs">
                                                                    {new Date(submission.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>

                                                            {/* Score */}
                                                            <div className="mb-2">
                                                                <span className="text-white text-sm font-medium">
                                                                    Score: <span className="text-indigo-400">{submission.score}</span>
                                                                </span>
                                                            </div>

                                                            {/* Error Display - Only for latest submission */}
                                                            {submission.error && isLatest && (
                                                                <div className="mt-2 bg-red-950/40 border border-red-800/50 rounded-md overflow-hidden">
                                                                    <div className="px-3 py-2 bg-red-900/30 border-b border-red-800/50">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                                            <span className="text-red-400 text-xs font-medium">Runtime Error</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-3">
                                                                        <div className="bg-red-900/20 border border-red-800/30 rounded text-xs font-mono text-red-300 p-2 max-h-24 overflow-y-auto overflow-x-auto whitespace-pre-wrap break-words">
                                                                            {submission.error}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="text-gray-500 text-sm mb-1">No submissions yet</div>
                                                <div className="text-gray-600 text-xs">Submit your code to see results here</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolveProblem;
