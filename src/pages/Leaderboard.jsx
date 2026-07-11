// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../services/api';

// const Leaderboard = () => {
//     const { competitionId } = useParams();
//     const [leaderboard, setLeaderboard] = useState([]);
//     const [competition, setCompetition] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchLeaderboard = async () => {
//             try {
//                 setLoading(true);

//                 // Get competition details
//                 const compRes = await api.get(`/competitions/${competitionId}`);
//                 setCompetition(compRes.data.competition);

//                 // Get leaderboard
//                 const leaderboardRes = await api.get(`/competitions/${competitionId}/leaderboard`);
//                 setLeaderboard(leaderboardRes.data.leaderboard || []);
//             } catch (err) {
//                 setError('Failed to load leaderboard');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLeaderboard();
//     }, [competitionId]);

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
//         <div className="min-h-screen bg-gray-950 p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Competition Header */}
//                 <div className="bg-gray-900 rounded-xl p-6 mb-6">
//                     <h1 className="text-3xl font-bold text-white mb-2">
//                         {competition?.title || 'Leaderboard'}
//                     </h1>
//                     <p className="text-gray-400">
//                         {competition?.description || 'Competition Leaderboard'}
//                     </p>
//                 </div>

//                 {/* Leaderboard Table */}
//                 <div className="bg-gray-900 rounded-xl p-6">
//                     <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>

//                     {leaderboard.length > 0 ? (
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="border-b border-gray-700 text-left">
//                                         <th className="pb-4 text-gray-400 font-medium">Rank</th>
//                                         <th className="pb-4 text-gray-400 font-medium">User</th>
//                                         <th className="pb-4 text-gray-400 font-medium text-right">Score</th>
//                                         <th className="pb-4 text-gray-400 font-medium">Time</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {leaderboard.map((entry, index) => (
//                                         <tr key={entry.userId} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
//                                             <td className="py-4">
//                                                 <div className="flex items-center">
//                                                     <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-600/20 text-yellow-400' :
//                                                             index === 1 ? 'bg-gray-600/20 text-gray-400' :
//                                                                 index === 2 ? 'bg-orange-600/20 text-orange-400' :
//                                                                     'bg-gray-700 text-gray-300'
//                                                         }`}>
//                                                         {index + 1}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="py-4">
//                                                 <span className="text-white font-medium">
//                                                     {entry.name}
//                                                 </span>
//                                             </td>
//                                             <td className="py-4 text-right">
//                                                 <span className="text-white font-bold text-lg">
//                                                     {`${entry.totalScore}`}
//                                                 </span>
//                                             </td>
//                                             <td className="py-4 text-gray-400 text-sm">
//                                                 {new Date(entry.earliestSubmission).toLocaleString()}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             <p className="text-gray-400 mb-4">No submissions yet</p>
//                             <p className="text-gray-500 text-sm">Once participants start solving problems, rankings will appear here</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Leaderboard;




import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

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

const RANK_META = [
    { medal: '🥇', ring: 'ring-yellow-400/40', glow: 'shadow-yellow-500/20', badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', bar: 'from-yellow-400 to-yellow-600' },
    { medal: '🥈', ring: 'ring-gray-300/40', glow: 'shadow-gray-400/10', badge: 'bg-gray-400/15 text-gray-200 border-gray-400/30', bar: 'from-gray-300 to-gray-500' },
    { medal: '🥉', ring: 'ring-orange-400/40', glow: 'shadow-orange-500/20', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', bar: 'from-orange-400 to-orange-600' },
];

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
                    <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <div className="relative text-center bg-[#12161f]/80 border border-red-500/20 rounded-xl px-8 py-6">
                    <svg className="w-10 h-10 text-red-500/70 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);
    // reorder for podium visual: [2nd, 1st, 3rd]
    const podiumOrder = topThree.length === 3
        ? [topThree[1], topThree[0], topThree[2]]
        : topThree.length === 2
            ? [topThree[1], topThree[0]]
            : topThree;

    return (
        <div className="min-h-screen bg-[#0A0D14] p-6 relative">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes podiumRise { from { opacity: 0; transform: translateY(30px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(12px,-14px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-14px,14px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                @keyframes shimmerGold { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
                .anim-fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .4s ease both; }
                .anim-podium { animation: podiumRise .55s cubic-bezier(.16,1,.3,1) both; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 12s ease-in-out infinite; }
                .bg-grid { background-image: linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 16s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .anim-shimmer-gold { animation: shimmerGold 2.2s ease-in-out infinite; }
                .row-hover { transition: background-color .2s ease, transform .2s ease; }
                .row-hover:hover { transform: translateX(2px); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-podium, .anim-float-a, .anim-float-b, .bg-grid, .anim-shimmer-gold, .row-hover { animation: none !important; transition: none !important; }
                }
            `}</style>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
                <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-a" />
                <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl anim-float-b" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Competition Header */}
                <div className="anim-fade-up relative bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-70" />
                    <div className="flex items-start gap-4">
                        <div className="relative shrink-0 hidden sm:flex">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 blur-md opacity-30" />
                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5M7.5 18.75v-4.5m4.5-4.5v9m0-9a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /></svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {competition?.title ? `${competition.title} Leaderboard` : 'Leaderboard'}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '120ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        Leaderboard
                    </h2>

                    {leaderboard.length > 0 ? (
                        <>
                            {/* Podium for top 3 */}
                            {topThree.length > 0 && (
                                <div className="flex items-end justify-center gap-3 sm:gap-6 mb-10 px-2">
                                    {podiumOrder.map((entry) => {
                                        const originalIndex = topThree.indexOf(entry);
                                        const meta = RANK_META[originalIndex];
                                        const isFirst = originalIndex === 0;
                                        const heights = isFirst ? 'pt-8 pb-6' : originalIndex === 1 ? 'pt-4 pb-5' : 'pt-2 pb-4';
                                        return (
                                            <div
                                                key={entry.userId}
                                                className={`anim-podium flex flex-col items-center rounded-xl border ${meta.ring} ring-1 bg-white/5 px-4 sm:px-6 ${heights} ${isFirst ? 'w-36 sm:w-44' : 'w-28 sm:w-36'} shadow-xl ${meta.glow}`}
                                                style={{ animationDelay: `${originalIndex * 100}ms` }}
                                            >
                                                <span className={`text-3xl sm:text-4xl mb-2 ${isFirst ? 'anim-shimmer-gold' : ''}`}>{meta.medal}</span>
                                                <p className="text-white font-semibold text-sm sm:text-base text-center truncate w-full">{entry.name}</p>
                                                <p className="text-white font-bold text-xl sm:text-2xl font-mono-ui mt-1">
                                                    <CountUp value={entry.totalScore} />
                                                </p>
                                                <div className={`mt-3 w-full h-1.5 rounded-full bg-gradient-to-r ${meta.bar}`} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full border-separate border-spacing-y-1">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Rank</th>
                                            <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide">User</th>
                                            <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide text-right">Score</th>
                                            <th className="pb-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((entry, index) => {
                                            const meta = RANK_META[index];
                                            return (
                                                <tr
                                                    key={entry.userId}
                                                    className="row-hover anim-fade-in bg-white/[0.02] hover:bg-white/[0.06]"
                                                    style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                                                >
                                                    <td className="py-3 px-2 rounded-l-lg">
                                                        <div className="flex items-center">
                                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${meta
                                                                ? `${meta.badge}`
                                                                : 'bg-white/5 text-gray-300 border-white/10'
                                                                }`}>
                                                                {meta ? <span className="text-base leading-none">{meta.medal}</span> : index + 1}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white font-mono-ui shrink-0">
                                                                {entry.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                            <span className="text-white font-medium">
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <span className="text-white font-bold text-lg font-mono-ui">
                                                            <CountUp value={entry.totalScore} />
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 rounded-r-lg text-gray-500 text-sm whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {new Date(entry.earliestSubmission).toLocaleString()}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 anim-fade-in">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
                                <svg className="relative w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 mb-2">No submissions yet</p>
                            <p className="text-gray-600 text-sm">Once participants start solving problems, rankings will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;