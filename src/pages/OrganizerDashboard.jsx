// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';

// const OrganizerDashboard = () => {
//     const [competitions, setCompetitions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchOrganizedCompetitions();
//     }, []);

//     const fetchOrganizedCompetitions = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get('/competitions/my-competitions');
//             setCompetitions(res.data.competitions || []);
//         } catch (err) {
//             setError('Failed to load competitions');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (date) => {
//         if (!date) return 'Not set';
//         return new Date(date).toLocaleString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const getCompetitionStatus = (startTime, endTime) => {
//         if (!startTime || !endTime) return { text: 'Not Scheduled', color: 'text-gray-400' };

//         const now = new Date();
//         const start = new Date(startTime);
//         const end = new Date(endTime);

//         if (now < start) return { text: 'Upcoming', color: 'text-blue-400' };
//         if (now > end) return { text: 'Ended', color: 'text-gray-400' };
//         return { text: 'Live', color: 'text-green-400' };
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//                 <div className="text-red-500 text-center">
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8">
//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Welcome Section */}
//                 <div className="mb-8">
//                     <h2 className="text-3xl text-white font-bold mb-2">
//                         Organizer Dashboard
//                     </h2>
//                     <p className="text-gray-400">
//                         Manage your competitions and problems
//                     </p>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-indigo-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Competitions Created</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {competitions.length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-green-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Active Contests</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {competitions.filter(c => {
//                                         const now = new Date();
//                                         return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
//                                     }).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-purple-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Total Participants</p>
//                                 <p className="text-3xl font-bold text-white">0</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Competitions List */}
//                 <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl text-white font-bold">
//                             My Competitions
//                         </h3>
//                         {competitions.length === 0 && (
//                             <p className="text-gray-400">No competitions created yet</p>
//                         )}
//                     </div>

//                     {competitions.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {competitions.map((competition) => {
//                                 const status = getCompetitionStatus(competition.startTime, competition.endTime);
//                                 return (
//                                     <div
//                                         key={competition._id}
//                                         className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-indigo-600 transition group"
//                                     >
//                                         <div className="flex justify-between items-start mb-3">
//                                             <h4 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
//                                                 {competition.title}
//                                             </h4>
//                                             <span className={`text-xs font-medium px-2 py-1 rounded ${status.color} bg-gray-900/50`}>
//                                                 {status.text}
//                                             </span>
//                                         </div>

//                                         <p className="text-gray-400 text-sm mb-4 line-clamp-2">
//                                             {competition.description || 'No description'}
//                                         </p>

//                                         <div className="space-y-2 mb-4 text-sm">
//                                             <div className="flex items-center gap-2 text-gray-400">
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <span>Starts: {formatDate(competition.startTime)}</span>
//                                             </div>
//                                             <div className="flex items-center gap-2 text-gray-400">
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <span>Ends: {formatDate(competition.endTime)}</span>
//                                             </div>
//                                             <div className="flex items-center gap-2 text-gray-400">
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h10" />
//                                                 </svg>
//                                                 <span>Room Code: <span className="text-white font-medium">{competition.roomCode}</span></span>
//                                             </div>
//                                         </div>

//                                         <div className="flex flex-wrap gap-2">
//                                             <Link
//                                                 to={`/competitions/${competition._id}`}
//                                                 className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
//                                             >
//                                                 View Details
//                                             </Link>
//                                             <Link
//                                                 to={`/organizer/competitions/${competition._id}/add-problem`}
//                                                 className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
//                                             >
//                                                 Add Problem
//                                             </Link>
//                                             <Link
//                                                 to={`/organizer/competitions/${competition._id}/add-testcase`}
//                                                 className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
//                                             >
//                                                 Add Test Case
//                                             </Link>
//                                             <Link
//                                                 to={`/organizer/competitions/${competition._id}/analytics`}
//                                                 className="flex-1 text-center px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
//                                             >
//                                                 View Analytics
//                                             </Link>
//                                             <Link
//                                                 to={`/competitions/${competition._id}/leaderboard`}
//                                                 className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
//                                             >
//                                                 Leaderboard
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                             </svg>
//                             <p className="text-gray-400 mb-4">
//                                 You haven't created any competitions yet
//                             </p>
//                             <Link
//                                 to="/organizer/create"
//                                 className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
//                             >
//                                 Create Your First Competition
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrganizerDashboard;


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

    // --- Dynamic Calculation Helper (No Backend Changes Needed) ---
    const getTotalUniqueParticipants = () => {
        const uniqueUsers = new Set();
        competitions.forEach(comp => {
            if (Array.isArray(comp.registeredUsers)) {
                comp.registeredUsers.forEach(userId => uniqueUsers.add(userId));
            }
        });
        return uniqueUsers.size;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <style>{`
                    @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                    .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.08) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 14s linear infinite; }
                    .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                `}</style>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                </div>
                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-lg opacity-40 animate-pulse" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-mono-ui text-white font-bold text-xl shadow-lg animate-spin" style={{ animationDuration: '2s' }}>
                            {'</>'}
                        </div>
                    </div>
                    <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" style={{ backgroundImage: 'linear-gradient(rgba(248,113,113,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(248,113,113,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                </div>
                <div className="relative text-center bg-[#12161f]/80 border border-red-500/20 rounded-xl px-8 py-6">
                    <svg className="w-10 h-10 text-red-500/70 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0D14] pt-8 relative">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(12px,-14px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-14px,14px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                .anim-fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .4s ease both; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 12s ease-in-out infinite; }
                .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 16s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .stat-card { position: relative; transition: transform .25s ease, box-shadow .25s ease; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(124,92,255,0.35); }
                .comp-card { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
                .comp-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -14px rgba(34,211,238,0.25); }
                .action-btn { transition: transform .15s ease, filter .15s ease; }
                .action-btn:hover { transform: translateY(-1px); }
                .action-btn:active { transform: scale(0.97); }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-float-a, .anim-float-b, .bg-grid, .stat-card, .comp-card, .action-btn { animation: none !important; transition: none !important; }
                }
            `}</style>

            {/* ambient backdrop - isolated so it never clips real content */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
                <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-a" />
                <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl anim-float-b" />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Welcome Section */}
                <div className="mb-8 anim-fade-up">
                    
                    <h2 className="text-3xl text-white font-bold mb-1 flex items-center gap-2">
                        Organizer Dashboard
                    </h2>
                    <p className="text-gray-500">
                        Manage your competitions and problems
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '60ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-xl border border-indigo-500/20">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Competitions Created</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    {competitions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '120ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/20">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Active Contests</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    {competitions.filter(c => {
                                        const now = new Date();
                                        return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '180ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Participants</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">getTotalUniqueParticipants() || 0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competitions List */}
                <div className="anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '240ms' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl text-white font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            My Competitions
                        </h3>
                        {competitions.length === 0 && (
                            <p className="text-gray-500 text-sm">No competitions created yet</p>
                        )}
                    </div>

                    {competitions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {competitions.map((competition, idx) => {
                                const status = getCompetitionStatus(competition.startTime, competition.endTime);
                                const statusDot = status.text === 'Live' ? 'bg-green-400 animate-pulse' : status.text === 'Upcoming' ? 'bg-blue-400' : status.text === 'Not Scheduled' ? 'bg-gray-500' : 'bg-gray-400';
                                return (
                                    <div
                                        key={competition._id}
                                        className="comp-card anim-fade-up bg-black/20 border border-white/10 rounded-xl p-6 hover:border-violet-500/40 group flex flex-col"
                                        style={{ animationDelay: `${idx * 60}ms` }}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                                                {competition.title}
                                            </h4>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color} bg-white/5 border border-white/10 whitespace-nowrap`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                                                {status.text}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {competition.description || 'No description'}
                                        </p>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <svg className="w-4 h-4 text-violet-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Starts: {formatDate(competition.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <svg className="w-4 h-4 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Ends: {formatDate(competition.endTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <svg className="w-4 h-4 text-yellow-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h10" />
                                                </svg>
                                                <span>Room Code: <span className="text-white font-mono-ui font-medium tracking-wide">{competition.roomCode}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto pt-1">
                                            <Link
                                                to={`/competitions/${competition._id}`}
                                                className="action-btn flex-1 text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-600/30 text-white rounded-lg text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/add-problem`}
                                                className="action-btn flex-1 text-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium"
                                            >
                                                Add Problem
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/add-testcase`}
                                                className="action-btn flex-1 text-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium"
                                            >
                                                Add Test Case
                                            </Link>
                                            <Link
                                                to={`/organizer/competitions/${competition._id}/analytics`}
                                                className="action-btn flex-1 text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-600/30 text-white rounded-lg text-sm font-medium"
                                            >
                                                View Analytics
                                            </Link>
                                            <Link
                                                to={`/competitions/${competition._id}/leaderboard`}
                                                className="action-btn flex-1 text-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                                Leaderboard
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 anim-fade-in">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
                                <svg className="relative w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 mb-4">
                                You haven't created any competitions yet
                            </p>
                            <Link
                                to="/organizer/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98] text-white rounded-lg font-medium transition-all"
                            >
                                Create Your First Competition
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;