import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrganizerDashboard = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrganizedCompetitions();
    }, []);

    const fetchOrganizedCompetitions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/competitions/my-competitions');
            setCompetitions(res.data.competitions || []);
        } catch (err) {
            setError('Failed to load competitions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl text-white font-bold mb-2">
                        Organizer Dashboard
                    </h2>
                    <p className="text-gray-400">
                        Manage your competitions and problems
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Competitions Created</p>
                                <p className="text-3xl font-bold text-white">
                                    {competitions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Contests</p>
                                <p className="text-3xl font-bold text-white">
                                    {competitions.filter(c => {
                                        const now = new Date();
                                        return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Participants</p>
                                <p className="text-3xl font-bold text-white">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competitions List */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl text-white font-bold">
                            My Competitions
                        </h3>
                        {competitions.length === 0 && (
                            <p className="text-gray-400">No competitions created yet</p>
                        )}
                    </div>

                    {competitions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {competitions.map((competition) => {
                                const status = getCompetitionStatus(competition.startTime, competition.endTime);
                                return (
                                    <div
                                        key={competition._id}
                                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-indigo-600 transition group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                                                {competition.title}
                                            </h4>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${status.color} bg-gray-900/50`}>
                                                {status.text}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {competition.description || 'No description'}
                                        </p>

                                        <div className="space-y-2 mb-4 text-sm">
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
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h10" />
                                                </svg>
                                                <span>Room Code: <span className="text-white font-medium">{competition.roomCode}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                to={`/competitions/${competition._id}`}
                                                className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/add-problem`}
                                                className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                Add Problem
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/add-testcase`}
                                                className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                Add Test Case
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/analytics`}
                                                className="flex-1 text-center px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                View Analytics
                                            </Link>
                                            <Link
                                                to={`/competitions/${competition._id}/leaderboard`}
                                                className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                Leaderboard
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-gray-400 mb-4">
                                You haven't created any competitions yet
                            </p>
                            <Link
                                to="/organizer/create"
                                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                            >
                                Create Your First Competition
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
