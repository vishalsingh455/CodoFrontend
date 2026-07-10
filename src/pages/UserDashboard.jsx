// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

// const UserDashboard = () => {
//     const [myCompetitions, setMyCompetitions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [user, setUser] = useState(null);
//     const [submissions, setSubmissions] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchUserData();
//         fetchMySubmissions();
//     }, []);

//     const fetchUserData = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("/user/dashboard");
//             setUser(res.data.user);
//             setMyCompetitions(res.data.registeredCompetitions || []);
//         } catch {
//             setError("Failed to load dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMySubmissions = async () => {
//         try {
//             const res = await api.get("/my-submissions");
//             setSubmissions(res.data.submissions || []);
//         } catch {
//             console.error("Failed to fetch submissions");
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             await api.post("/auth/logout");
//             navigate("/");
//             window.location.reload();
//         } catch {
//             console.error("Logout failed");
//         }
//     };

//     const formatDate = (date) => {
//         if (!date) return "Not set";
//         return new Date(date).toLocaleString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit"
//         });
//     };

//     const getCompetitionStatus = (startTime, endTime) => {
//         const now = new Date();
//         const start = new Date(startTime);
//         const end = new Date(endTime);

//         if (now < start) return { text: "Upcoming", color: "text-blue-400" };
//         if (now > end) return { text: "Ended", color: "text-gray-400" };
//         return { text: "Live", color: "text-green-400" };
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8">
//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Welcome Section */}
//                 <div className="mb-8">
//                     <h2 className="text-3xl text-white font-bold mb-2">
//                         Welcome back, {user?.name || "User"}!
//                     </h2>
//                     <p className="text-gray-400">
//                         Track your competitions and submissions
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
//                                 <p className="text-gray-400 text-sm">Competitions Joined</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {myCompetitions.filter(c => {
//                                         const now = new Date();
//                                         return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
//                                     }).length}
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
//                                     {myCompetitions.filter(c => {
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
//                                 <p className="text-gray-400 text-sm">Total Submissions</p>
//                                 <p className="text-3xl font-bold text-white">{submissions.length}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Additional Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-green-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Accepted Submissions</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {submissions.filter(sub => sub.status === 'accepted').length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-red-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Rejected Submissions</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {submissions.filter(sub => sub.status === 'rejected').length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-yellow-600/20 rounded-lg">
//                                 <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-sm">Total Score</p>
//                                 <p className="text-3xl font-bold text-white">
//                                     {submissions.reduce((sum, sub) => sum + (sub.score || 0), 0)}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Competitions List */}
//                 <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
//                     <h3 className="text-2xl text-white font-bold mb-6">
//                         My Competitions
//                     </h3>

//                     {loading ? (
//                         <div className="text-center py-12">
//                             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-indigo-600"></div>
//                             <p className="text-gray-400 mt-4">Loading competitions...</p>
//                         </div>
//                     ) : error ? (
//                         <div className="text-center py-12">
//                             <p className="text-red-400">{error}</p>
//                         </div>
//                     ) : myCompetitions.length === 0 ? (
//                         <div className="text-center py-12">
//                             <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                             </svg>
//                             <p className="text-gray-400 mb-4">
//                                 You haven't joined any competitions yet
//                             </p>
//                             <Link
//                                 to="/join"
//                                 className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
//                             >
//                                 Join Your First Competition
//                             </Link>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {myCompetitions
//                                 .filter((competition) => {
//                                     // Only show active competitions (not ended/expired)
//                                     const now = new Date();
//                                     const start = new Date(competition.startTime);
//                                     const end = new Date(competition.endTime);
//                                     return now >= start && now <= end; // Active competitions only
//                                 })
//                                 .map((competition) => {
//                                     const status = getCompetitionStatus(competition.startTime, competition.endTime);
//                                     return (
//                                         <div
//                                             key={competition._id}
//                                             className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-indigo-600 transition group"
//                                         >
//                                             <div className="flex justify-between items-start mb-3">
//                                                 <h4 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
//                                                     {competition.title}
//                                                 </h4>
//                                                 <span className={`text-xs font-medium px-2 py-1 rounded ${status.color} bg-gray-900/50`}>
//                                                     {status.text}
//                                                 </span>
//                                             </div>

//                                             <p className="text-gray-400 text-sm mb-4 line-clamp-2">
//                                                 {competition.description || "No description"}
//                                             </p>

//                                             <div className="space-y-2 mb-4 text-sm">
//                                                 <div className="flex items-center gap-2 text-gray-400">
//                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                     </svg>
//                                                     <span>Starts: {formatDate(competition.startTime)}</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-2 text-gray-400">
//                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                     </svg>
//                                                     <span>Ends: {formatDate(competition.endTime)}</span>
//                                                 </div>
//                                             </div>

//                                             <div className="flex gap-2">
//                                                 <Link
//                                                     to={`/competitions/${competition._id}`}
//                                                     className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
//                                                 >
//                                                     View Problems
//                                                 </Link>
//                                                 <Link
//                                                     to={`/competitions/${competition._id}/leaderboard`}
//                                                     className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
//                                                 >
//                                                     Leaderboard
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;




import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

// Purely visual: animates a number counting up to its target value on change.
// Does not affect the underlying data, only how it's displayed.
const CountUp = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const target = Number(value) || 0;
        if (target === 0) { setDisplay(0); return; }
        let frame;
        const duration = 600;
        const start = performance.now();
        const startVal = 0;
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(startVal + (target - startVal) * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value]);
    return <>{display}</>;
};

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

    const activeCompetitionsCount = myCompetitions.filter(c => {
        const now = new Date();
        return new Date(c.startTime) <= now && new Date(c.endTime) >= now;
    }).length;

    const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#0A0D14] pt-8 relative overflow-hidden">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(12px,-14px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-14px,14px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                @keyframes spinSlow { to { transform: rotate(360deg); } }
                .anim-fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .4s ease both; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 12s ease-in-out infinite; }
                .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 16s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .stat-card { position: relative; overflow: hidden; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(124,92,255,0.35); }
                .comp-card { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
                .comp-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -14px rgba(34,211,238,0.25); }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-float-a, .anim-float-b, .bg-grid, .stat-card, .comp-card { animation: none !important; transition: none !important; }
                }
            `}</style>

            {/* ambient backdrop */}
            <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-a pointer-events-none" />
            <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl anim-float-b pointer-events-none" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Welcome Section */}
                <div className="mb-8 flex items-center justify-between anim-fade-up">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 blur-md opacity-40" />
                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-mono-ui text-white font-bold text-lg shadow-lg">
                                {initials}
                            </div>
                        </div>
                        <div>

                            <h2 className="text-3xl text-white font-bold">
                                Welcome back, {user?.name || "User"}!
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                Track your competitions and submissions
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-red-300 hover:border-red-500/30 hover:bg-red-500/10 transition-all text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                        Log out
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '60ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-xl border border-indigo-500/20">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Competitions Joined</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    <CountUp value={activeCompetitionsCount} />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '120ms' }}>
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
                                    <CountUp value={activeCompetitionsCount} />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '180ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Submissions</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    <CountUp value={submissions.length} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '240ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/20">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Accepted Submissions</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    <CountUp value={submissions.filter(sub => sub.status === 'accepted').length} />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '300ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl border border-red-500/20">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Rejected Submissions</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    <CountUp value={submissions.filter(sub => sub.status === 'rejected').length} />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '360ms' }}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Score</p>
                                <p className="text-3xl font-bold text-white font-mono-ui">
                                    <CountUp value={submissions.reduce((sum, sub) => sum + (sub.score || 0), 0)} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competitions List */}
                <div className="anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '420ms' }}>
                    <div className="flex items-center gap-2 mb-6">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5M7.5 18.75v-4.5m4.5-4.5v9m0-9a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /></svg>
                        <h3 className="text-2xl text-white font-bold">
                            My Competitions
                        </h3>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="relative w-12 h-12 mx-auto mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 blur-md opacity-30" />
                                <div className="relative inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-violet-500"></div>
                            </div>
                            <p className="text-gray-500 font-mono-ui text-sm">Loading competitions...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 anim-fade-in">
                            <svg className="w-10 h-10 text-red-500/60 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : myCompetitions.length === 0 ? (
                        <div className="text-center py-12 anim-fade-in">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
                                <svg className="relative w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-400 mb-4">
                                You haven't joined any competitions yet
                            </p>
                            <Link
                                to="/join"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98] text-white rounded-lg font-medium transition-all"
                            >
                                Join Your First Competition
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
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
                                .map((competition, idx) => {
                                    const status = getCompetitionStatus(competition.startTime, competition.endTime);
                                    const statusDot = status.text === 'Live' ? 'bg-green-400 animate-pulse' : status.text === 'Upcoming' ? 'bg-blue-400' : 'bg-gray-400';
                                    return (
                                        <div
                                            key={competition._id}
                                            className="comp-card anim-fade-up bg-black/20 border border-white/10 rounded-xl p-6 hover:border-cyan-500/40 group"
                                            style={{ animationDelay: `${idx * 60}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                                    {competition.title}
                                                </h4>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color} bg-white/5 border border-white/10`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                                                    {status.text}
                                                </span>
                                            </div>

                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                {competition.description || "No description"}
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
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/competitions/${competition._id}`}
                                                    className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-600/30 text-white rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
                                                >
                                                    View Problems
                                                </Link>
                                                <Link
                                                    to={`/competitions/${competition._id}/leaderboard`}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
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
