// import { useEffect, useState, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../services/api";

// const Analytics = () => {
//     const { competitionId } = useParams();
//     const [analytics, setAnalytics] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchAnalytics = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get(`/competitions/${competitionId}/analytics`);
//             setAnalytics(res.data.analytics);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to load analytics");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAnalyticsMemo = useCallback(fetchAnalytics, [competitionId]);

//     useEffect(() => {
//         fetchAnalyticsMemo();
//     }, [fetchAnalyticsMemo]);

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
//                     <Link to="/organizer" className="text-indigo-400 hover:underline mt-4 inline-block">
//                         Go back
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!analytics) {
//         return (
//             <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//                 <div className="text-gray-500">No analytics available</div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-950 p-6">
//             <div className="max-w-6xl mx-auto space-y-6">
//                 <div className="bg-gray-900 rounded-xl p-6">
//                     <div className="flex justify-between items-center">
//                         <h1 className="text-3xl font-bold text-white">
//                             {analytics.competitionTitle} Analytics
//                         </h1>
//                         <Link
//                             to={`/competitions/${competitionId}`}
//                             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
//                         >
//                             View Competition
//                         </Link>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="bg-gray-900 rounded-xl p-6">
//                         <p className="text-gray-400 text-sm">Total Participants</p>
//                         <p className="text-3xl font-bold text-white">{analytics.totalParticipants}</p>
//                     </div>
//                     <div className="bg-gray-900 rounded-xl p-6">
//                         <p className="text-gray-400 text-sm">Total Submissions</p>
//                         <p className="text-3xl font-bold text-white">{analytics.totalSubmissions}</p>
//                     </div>
//                     <div className="bg-gray-900 rounded-xl p-6">
//                         <p className="text-gray-400 text-sm">Accepted</p>
//                         <p className="text-3xl font-bold text-white">{analytics.acceptedSubmissions}</p>
//                     </div>
//                     <div className="bg-gray-900 rounded-xl p-6">
//                         <p className="text-gray-400 text-sm">Rejected</p>
//                         <p className="text-3xl font-bold text-white">{analytics.rejectedSubmissions}</p>
//                     </div>
//                 </div>

//                 <div className="bg-gray-900 rounded-xl p-6">
//                     <h2 className="text-2xl font-bold text-white mb-4">Problem Stats</h2>
//                     {analytics.problemStats.length > 0 ? (
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="border-b border-gray-700 text-left">
//                                         <th className="pb-4 text-gray-400 font-medium">Problem</th>
//                                         <th className="pb-4 text-gray-400 font-medium">Difficulty</th>
//                                         <th className="pb-4 text-gray-400 font-medium text-right">Attempts</th>
//                                         <th className="pb-4 text-gray-400 font-medium text-right">Accepted</th>
//                                         <th className="pb-4 text-gray-400 font-medium text-right">Acceptance Rate</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {analytics.problemStats.map((p, index) => (
//                                         <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
//                                             <td className="py-4 text-white">{p.problemTitle}</td>
//                                             <td className="py-4 text-gray-300">{p.difficulty}</td>
//                                             <td className="py-4 text-right text-white">{p.totalAttempts}</td>
//                                             <td className="py-4 text-right text-white">{p.accepted}</td>
//                                             <td className="py-4 text-right text-white">{p.acceptanceRate}%</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-400">No problem stats available</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Analytics;



import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

// Purely visual: animates a number counting up to its target value. Doesn't affect data.
const CountUp = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const target = Number(value) || 0;
        if (target === 0) { setDisplay(0); return; }
        let frame;
        const duration = 700;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(target * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value]);
    return <>{display}</>;
};

const DIFFICULTY_META = {
    easy: { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    medium: { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    hard: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

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
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <style>{`
                    @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                    .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                `}</style>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" style={{ backgroundImage: 'linear-gradient(rgba(124,92,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px', animation: 'gridPan 14s linear infinite' }} />
                </div>
                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-lg opacity-40 animate-pulse" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-mono-ui text-white font-bold text-xl shadow-lg animate-spin" style={{ animationDuration: '2s' }}>
                            {'</>'}
                        </div>
                    </div>
                    <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Crunching analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <div className="relative text-center bg-[#12161f]/80 border border-red-500/20 rounded-xl px-8 py-6">
                    <svg className="w-10 h-10 text-red-500/70 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    <p className="text-red-400 mb-3">{error}</p>
                    <Link to="/organizer" className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <div className="relative text-center">
                    <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                    <div className="text-gray-500">No analytics available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0D14] p-6 relative">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(12px,-14px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-14px,14px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                @keyframes growBar { from { width: 0%; } }
                .anim-fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .4s ease both; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 12s ease-in-out infinite; }
                .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 16s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .stat-card { position: relative; transition: transform .25s ease, box-shadow .25s ease; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(124,92,255,0.3); }
                .row-hover { transition: background-color .2s ease, transform .2s ease; }
                .row-hover:hover { transform: translateX(2px); }
                .anim-bar { animation: growBar 1s cubic-bezier(.16,1,.3,1) both; }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-float-a, .anim-float-b, .bg-grid, .stat-card, .row-hover, .anim-bar { animation: none !important; transition: none !important; }
                }
            `}</style>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
                <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-a" />
                <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl anim-float-b" />
            </div>

            <div className="max-w-6xl mx-auto space-y-6 relative z-10">
                {/* Header */}
                <div className="anim-fade-up relative bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-70" />
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                {analytics.competitionTitle} Analytics
                            </h1>
                        </div>
                        <Link
                            to={`/competitions/${competitionId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98] text-white rounded-lg text-sm font-medium transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            View Competition
                        </Link>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '60ms' }}>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-lg border border-indigo-500/20">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584a6.062 6.062 0 01-.037-.666L6 18.72m12 0a5.97 5.97 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.682 2.72 9.094 9.094 0 003.742.479m.001-.031a5.97 5.97 0 01.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Total Participants</p>
                                <p className="text-2xl font-bold text-white font-mono-ui"><CountUp value={analytics.totalParticipants} /></p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '120ms' }}>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/20">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Total Submissions</p>
                                <p className="text-2xl font-bold text-white font-mono-ui"><CountUp value={analytics.totalSubmissions} /></p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '180ms' }}>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-500/20">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Accepted</p>
                                <p className="text-2xl font-bold text-white font-mono-ui"><CountUp value={analytics.acceptedSubmissions} /></p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden" style={{ animationDelay: '240ms' }}>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg border border-red-500/20">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Rejected</p>
                                <p className="text-2xl font-bold text-white font-mono-ui"><CountUp value={analytics.rejectedSubmissions} /></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problem Stats */}
                <div className="anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '300ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-3.75L12 17.25m4.5-9.75h-3m1.5 0V3.104" /></svg>
                        Problem Stats
                    </h2>
                    {analytics.problemStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-1">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Problem</th>
                                        <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Difficulty</th>
                                        <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide text-right">Attempts</th>
                                        <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide text-right">Accepted</th>
                                        <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide text-right w-48">Acceptance Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.problemStats.map((p, index) => {
                                        const diffMeta = DIFFICULTY_META[p.difficulty?.toLowerCase?.()] || { dot: 'bg-gray-400', text: 'text-gray-300', bg: 'bg-gray-500/10', border: 'border-gray-500/30' };
                                        const rate = Math.max(0, Math.min(100, Number(p.acceptanceRate) || 0));
                                        const barColor = rate >= 66 ? 'from-green-500 to-green-400' : rate >= 33 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400';
                                        return (
                                            <tr key={index} className="row-hover anim-fade-in bg-white/[0.02] hover:bg-white/[0.06]" style={{ animationDelay: `${index * 50}ms` }}>
                                                <td className="py-3 px-2 rounded-l-lg text-white font-medium">{p.problemTitle}</td>
                                                <td className="py-3 px-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${diffMeta.bg} ${diffMeta.border} ${diffMeta.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                                                        {p.difficulty}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-right text-white font-mono-ui"><CountUp value={p.totalAttempts} /></td>
                                                <td className="py-3 px-2 text-right text-white font-mono-ui"><CountUp value={p.accepted} /></td>
                                                <td className="py-3 px-2 rounded-r-lg">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                            <div
                                                                className={`anim-bar h-full rounded-full bg-gradient-to-r ${barColor}`}
                                                                style={{ width: `${rate}%`, animationDelay: `${index * 50 + 100}ms` }}
                                                            />
                                                        </div>
                                                        <span className="text-white text-sm font-mono-ui w-10 text-right">{p.acceptanceRate}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 anim-fade-in">
                            <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                            <p className="text-gray-400">No problem stats available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
