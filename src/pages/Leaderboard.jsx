import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Leaderboard = () => {
    const { competitionId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                
                // Get competition details
                const compRes = await api.get(`/competitions/${competitionId}`);
                setCompetition(compRes.data.competition);
                
                // Get leaderboard
                const leaderboardRes = await api.get(`/competitions/${competitionId}/leaderboard`);
                setLeaderboard(leaderboardRes.data.leaderboard || []);
            } catch (err) {
                setError('Failed to load leaderboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [competitionId]);

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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Competition Header */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {competition?.title || 'Leaderboard'}
                    </h1>
                    <p className="text-gray-400">
                        {competition?.description || 'Competition Leaderboard'}
                    </p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-gray-900 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>
                    
                    {leaderboard.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700 text-left">
                                        <th className="pb-4 text-gray-400 font-medium">Rank</th>
                                        <th className="pb-4 text-gray-400 font-medium">User</th>
                                        <th className="pb-4 text-gray-400 font-medium text-right">Score</th>
                                        <th className="pb-4 text-gray-400 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={entry.userId} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                        index === 0 ? 'bg-yellow-600/20 text-yellow-400' :
                                                        index === 1 ? 'bg-gray-600/20 text-gray-400' :
                                                        index === 2 ? 'bg-orange-600/20 text-orange-400' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-white font-medium">
                                                    {entry.name}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-white font-bold text-lg">
                                                    {entry.totalScore}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400 text-sm">
                                                {new Date(entry.earliestSubmission).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-400 mb-4">No submissions yet</p>
                            <p className="text-gray-500 text-sm">Once participants start solving problems, rankings will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
