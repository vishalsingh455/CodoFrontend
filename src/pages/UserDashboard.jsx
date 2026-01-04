import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const UserDashboard = () => {
    const [myCompetitions, setMyCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchMySubmissions();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/dashboard");
            setUser(res.data.user);
            setMyCompetitions(res.data.registeredCompetitions || []);
        } catch {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchMySubmissions = async () => {
        try {
            const res = await api.get("/my-submissions");
            setSubmissions(res.data.submissions || []);
        } catch {
            console.error("Failed to fetch submissions");
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            navigate("/");
            window.location.reload();
        } catch {
            console.error("Logout failed");
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getCompetitionStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return { text: "Upcoming", color: "text-blue-400" };
        if (now > end) return { text: "Ended", color: "text-gray-400" };
        return { text: "Live", color: "text-green-400" };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl text-white font-bold mb-2">
                        Welcome back, {user?.name || "User"}!
                    </h2>
                    <p className="text-gray-400">
                        Track your competitions and submissions
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
                                <p className="text-gray-400 text-sm">Competitions Joined</p>
                                <p className="text-3xl font-bold text-white">
                                    {myCompetitions.filter(c => {
                                        const now = new Date();
                                        return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
                                    }).length}
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
                                    {myCompetitions.filter(c => {
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
                                <p className="text-gray-400 text-sm">Total Submissions</p>
                                <p className="text-3xl font-bold text-white">{submissions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Accepted Submissions</p>
                                <p className="text-3xl font-bold text-white">
                                    {submissions.filter(sub => sub.status === 'accepted').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Rejected Submissions</p>
                                <p className="text-3xl font-bold text-white">
                                    {submissions.filter(sub => sub.status === 'rejected').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-600/20 rounded-lg">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Score</p>
                                <p className="text-3xl font-bold text-white">
                                    {submissions.reduce((sum, sub) => sum + (sub.score || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competitions List */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                    <h3 className="text-2xl text-white font-bold mb-6">
                        My Competitions
                    </h3>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-indigo-600"></div>
                            <p className="text-gray-400 mt-4">Loading competitions...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : myCompetitions.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-400 mb-4">
                                You haven't joined any competitions yet
                            </p>
                            <Link
                                to="/join"
                                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                            >
                                Join Your First Competition
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCompetitions
                                .filter((competition) => {
                                    // Only show active competitions (not ended/expired)
                                    const now = new Date();
                                    const start = new Date(competition.startTime);
                                    const end = new Date(competition.endTime);
                                    return now >= start && now <= end; // Active competitions only
                                })
                                .map((competition) => {
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
                                            {competition.description || "No description"}
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
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/competitions/${competition._id}`}
                                                className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                View Problems
                                            </Link>
                                            <Link
                                                to={`/competitions/${competition._id}/leaderboard`}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                                            >
                                                Leaderboard
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
