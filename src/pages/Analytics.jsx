import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const Analytics = () => {
    const { competitionId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/competitions/${competitionId}/analytics`);
            setAnalytics(res.data.analytics);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalyticsMemo = useCallback(fetchAnalytics, [competitionId]);

    useEffect(() => {
        fetchAnalyticsMemo();
    }, [fetchAnalyticsMemo]);

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
                    <Link to="/organizer" className="text-indigo-400 hover:underline mt-4 inline-block">
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-500">No analytics available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-gray-900 rounded-xl p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">
                            {analytics.competitionTitle} Analytics
                        </h1>
                        <Link
                            to={`/competitions/${competitionId}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            View Competition
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-900 rounded-xl p-6">
                        <p className="text-gray-400 text-sm">Total Participants</p>
                        <p className="text-3xl font-bold text-white">{analytics.totalParticipants}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6">
                        <p className="text-gray-400 text-sm">Total Submissions</p>
                        <p className="text-3xl font-bold text-white">{analytics.totalSubmissions}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6">
                        <p className="text-gray-400 text-sm">Accepted</p>
                        <p className="text-3xl font-bold text-white">{analytics.acceptedSubmissions}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6">
                        <p className="text-gray-400 text-sm">Rejected</p>
                        <p className="text-3xl font-bold text-white">{analytics.rejectedSubmissions}</p>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Problem Stats</h2>
                    {analytics.problemStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700 text-left">
                                        <th className="pb-4 text-gray-400 font-medium">Problem</th>
                                        <th className="pb-4 text-gray-400 font-medium">Difficulty</th>
                                        <th className="pb-4 text-gray-400 font-medium text-right">Attempts</th>
                                        <th className="pb-4 text-gray-400 font-medium text-right">Accepted</th>
                                        <th className="pb-4 text-gray-400 font-medium text-right">Acceptance Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.problemStats.map((p, index) => (
                                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                            <td className="py-4 text-white">{p.problemTitle}</td>
                                            <td className="py-4 text-gray-300">{p.difficulty}</td>
                                            <td className="py-4 text-right text-white">{p.totalAttempts}</td>
                                            <td className="py-4 text-right text-white">{p.accepted}</td>
                                            <td className="py-4 text-right text-white">{p.acceptanceRate}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400">No problem stats available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
