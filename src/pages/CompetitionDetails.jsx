import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CompetitionTimer from '../components/CompetitionTimer';

const CompetitionDetails = () => {
    const { competitionId } = useParams();
    const [competition, setCompetition] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mySubmissions, setMySubmissions] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const fetchCompetitionDetails = async () => {
        try {
            setLoading(true);
            // First, get competition details
            const compRes = await api.get(`/competitions/${competitionId}`);
            setCompetition(compRes.data.competition);

            // Then, get problems for this competition
            const problemsRes = await api.get(`/problems/competition/${competitionId}`);
            setProblems(problemsRes.data.problems || []);

            // Fetch my submissions to compute per-problem status
            const subsRes = await api.get('/my-submissions');
            setMySubmissions(subsRes.data.submissions || []);
        } catch (err) {
            setError('Failed to load competition details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompetitionDetailsMemo = useCallback(fetchCompetitionDetails, [competitionId]);

    useEffect(() => {
        fetchCompetitionDetailsMemo();
    }, [fetchCompetitionDetailsMemo]);

    const formatDate = (date) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCompetitionStatus = (startTime, endTime) => {
        if (!startTime || !endTime) return { text: 'Not Scheduled', color: 'text-gray-400' };

        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return { text: 'Upcoming', color: 'text-blue-400' };
        if (now > end) return { text: 'Ended', color: 'text-gray-400' };
        return { text: 'Live', color: 'text-green-400' };
    };

    const handleSubmitCompetition = async () => {
        try {
            setSubmitting(true);
            setSubmitMessage('');

            await api.post(`/competitions/${competitionId}/submit`);

            setSubmitMessage('Competition submitted successfully!');
            // Optionally refresh the page or update state
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setSubmitMessage(`Failed to submit competition: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <Link to="/dashboard" className="text-indigo-400 hover:underline mt-4 inline-block">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!competition) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-500">Competition not found</div>
            </div>
        );
    }

    const status = getCompetitionStatus(competition.startTime, competition.endTime);

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Competition Header */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    {submitMessage && (
                        <div className={`mb-4 p-3 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'}`}>
                            {submitMessage}
                        </div>
                    )}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {competition.title}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {competition.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Starts: {formatDate(competition.startTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Ends: {formatDate(competition.endTime)}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} bg-gray-800`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <CompetitionTimer
                                startTime={competition.startTime}
                                endTime={competition.endTime}
                            />
                        </div>
                        <div className="flex gap-3">
                            {(status.text === 'Live' || status.text === 'Ended') && (
                                <button
                                    onClick={handleSubmitCompetition}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Competition'}
                                </button>
                            )}
                            <Link
                                to={`/competitions/${competition._id}/leaderboard`}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                            >
                                View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="bg-gray-900 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Problems</h2>
                        {problems.length === 0 && (
                            <p className="text-gray-400">No problems added yet</p>
                        )}
                    </div>

                    {problems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {problems.map((problem) => {
                                const attempts = mySubmissions.filter(s => s.problem?._id === problem._id);
                                const solved = attempts.some(s => s.status === 'accepted');
                                const statusText = attempts.length === 0 ? 'Not Attempted' : solved ? 'Solved' : 'Attempted';
                                const statusColor = attempts.length === 0 ? 'text-gray-400' : solved ? 'text-green-400' : 'text-yellow-400';
                                return (
                                    <Link
                                        key={problem._id}
                                        to={`/problems/${problem._id}`}
                                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
                                                {problem.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    problem.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
                                                    problem.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                                                    'bg-red-600/20 text-red-400'
                                                }`}>
                                                    {problem.difficulty}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor} bg-gray-900/40`}>
                                                    {statusText}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                            {problem.statement.substring(0, 100)}...
                                        </p>
                                        <div className="mt-3 text-sm text-gray-300">
                                            <span className="font-medium text-white">
                                                {problem.marksPerTestCase}
                                            </span>{" "}
                                            points per test case
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-gray-400 mb-4">No problems available yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompetitionDetails;
