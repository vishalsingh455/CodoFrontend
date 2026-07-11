// import { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../services/api';
// import CompetitionTimer from '../components/CompetitionTimer';

// const CompetitionDetails = () => {
//     const { competitionId } = useParams();
//     const [competition, setCompetition] = useState(null);
//     const [problems, setProblems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [mySubmissions, setMySubmissions] = useState([]);
//     const [submitting, setSubmitting] = useState(false);
//     const [submitMessage, setSubmitMessage] = useState('');

//     const fetchCompetitionDetails = async () => {
//         try {
//             setLoading(true);
//             // First, get competition details
//             const compRes = await api.get(`/competitions/${competitionId}`);
//             setCompetition(compRes.data.competition);

//             // Then, get problems for this competition
//             const problemsRes = await api.get(`/problems/competition/${competitionId}`);
//             setProblems(problemsRes.data.problems || []);

//             // Fetch my submissions to compute per-problem status
//             const subsRes = await api.get('/my-submissions');
//             setMySubmissions(subsRes.data.submissions || []);
//         } catch (err) {
//             setError('Failed to load competition details');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchCompetitionDetailsMemo = useCallback(fetchCompetitionDetails, [competitionId]);

//     useEffect(() => {
//         fetchCompetitionDetailsMemo();
//     }, [fetchCompetitionDetailsMemo]);

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

//     const handleSubmitCompetition = async () => {
//         try {
//             setSubmitting(true);
//             setSubmitMessage('');

//             await api.post(`/competitions/${competitionId}/submit`);

//             setSubmitMessage('Competition submitted successfully!');
//             // Optionally refresh the page or update state
//             setTimeout(() => {
//                 window.location.reload();
//             }, 1500);
//         } catch (err) {
//             setSubmitMessage(`Failed to submit competition: ${err.response?.data?.message || err.message}`);
//         } finally {
//             setSubmitting(false);
//         }
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
//                     <Link to="/dashboard" className="text-indigo-400 hover:underline mt-4 inline-block">
//                         Go to Dashboard
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!competition) {
//         return (
//             <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//                 <div className="text-gray-500">Competition not found</div>
//             </div>
//         );
//     }

//     const status = getCompetitionStatus(competition.startTime, competition.endTime);

//     return (
//         <div className="min-h-screen bg-gray-950 p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Competition Header */}
//                 <div className="bg-gray-900 rounded-xl p-6 mb-6">
//                     {submitMessage && (
//                         <div className={`mb-4 p-3 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'}`}>
//                             {submitMessage}
//                         </div>
//                     )}
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h1 className="text-3xl font-bold text-white mb-2">
//                                 {competition.title}
//                             </h1>
//                             <p className="text-gray-400 mb-4">
//                                 {competition.description || 'No description provided'}
//                             </p>
//                             <div className="flex items-center gap-4 text-sm">
//                                 <div className="flex items-center gap-2 text-gray-400">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     <span>Starts: {formatDate(competition.startTime)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-gray-400">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     <span>Ends: {formatDate(competition.endTime)}</span>
//                                 </div>
//                                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} bg-gray-800`}>
//                                     {status.text}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="flex flex-col items-end gap-3">
//                             <CompetitionTimer
//                                 startTime={competition.startTime}
//                                 endTime={competition.endTime}
//                             />
//                         </div>
//                         <div className="flex gap-3">
//                             {(status.text === 'Live' || status.text === 'Ended') && (
//                                 <button
//                                     onClick={handleSubmitCompetition}
//                                     disabled={submitting}
//                                     className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
//                                 >
//                                     {submitting ? 'Submitting...' : 'Submit Competition'}
//                                 </button>
//                             )}
//                             <Link
//                                 to={`/competitions/${competition._id}/leaderboard`}
//                                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
//                             >
//                                 View Leaderboard
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Problems List */}
//                 <div className="bg-gray-900 rounded-xl p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-white">Problems</h2>
//                         {problems.length === 0 && (
//                             <p className="text-gray-400">No problems added yet</p>
//                         )}
//                     </div>

//                     {problems.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {problems.map((problem) => {
//                                 const attempts = mySubmissions.filter(s => s.problem?._id === problem._id);
//                                 const solved = attempts.some(s => s.status === 'accepted');
//                                 const statusText = attempts.length === 0 ? 'Not Attempted' : solved ? 'Solved' : 'Attempted';
//                                 const statusColor = attempts.length === 0 ? 'text-gray-400' : solved ? 'text-green-400' : 'text-yellow-400';
//                                 return (
//                                     <Link
//                                         key={problem._id}
//                                         to={`/problems/${problem._id}`}
//                                         className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition group"
//                                     >
//                                         <div className="flex justify-between items-start">
//                                             <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
//                                                 {problem.title}
//                                             </h3>
//                                             <div className="flex items-center gap-2">
//                                                 <span className={`px-2 py-1 rounded text-xs font-medium ${problem.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
//                                                         problem.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
//                                                             'bg-red-600/20 text-red-400'
//                                                     }`}>
//                                                     {problem.difficulty}
//                                                 </span>
//                                                 <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor} bg-gray-900/40`}>
//                                                     {statusText}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <p className="text-gray-400 text-sm mt-2 line-clamp-2">
//                                             {problem.description ? problem.description.substring(0, 100) + '...' : 'No description available'}
//                                         </p>
//                                         <div className="mt-3 text-sm text-gray-300">
//                                             <span className="font-medium text-white">
//                                                 {problem.marksPerTestCase}
//                                             </span>{" "}
//                                             points per test case
//                                         </div>
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                             </svg>
//                             <p className="text-gray-400 mb-4">No problems available yet</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CompetitionDetails;




import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CompetitionTimer from '../components/CompetitionTimer';

const DIFFICULTY_META = {
    easy: { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    medium: { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    hard: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

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
                    <p className="font-mono-ui text-sm text-gray-400 tracking-wide">Loading competition...</p>
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
                    <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!competition) {
        return (
            <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
                <div className="relative text-center">
                    <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="text-gray-500">Competition not found</div>
                </div>
            </div>
        );
    }

    const status = getCompetitionStatus(competition.startTime, competition.endTime);
    const statusDot = status.text === 'Live' ? 'bg-green-400 animate-pulse' : status.text === 'Upcoming' ? 'bg-blue-400' : status.text === 'Not Scheduled' ? 'bg-gray-500' : 'bg-gray-400';

    return (
        <div className="min-h-screen bg-[#0A0D14] p-6 relative">
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
                .problem-card { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
                .problem-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -14px rgba(124,92,255,0.3); }
                .action-btn { transition: transform .15s ease, filter .15s ease; }
                .action-btn:hover { transform: translateY(-1px); }
                .action-btn:active { transform: scale(0.97); }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-float-a, .anim-float-b, .bg-grid, .problem-card, .action-btn { animation: none !important; transition: none !important; }
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

                    {submitMessage && (
                        <div className={`anim-fade-up mb-4 flex items-center gap-2.5 p-3 rounded-lg text-sm font-medium border ${submitMessage.includes('successfully') ? 'bg-green-900/20 text-green-300 border-green-700/50' : 'bg-red-900/20 text-red-300 border-red-700/50'}`}>
                            {submitMessage.includes('successfully') ? (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                            )}
                            {submitMessage}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1 min-w-0">
                            
                            <h1 className="text-3xl font-bold text-white mb-2 break-words">
                                {competition.title}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {competition.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap text-sm">
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
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color} bg-white/5 border border-white/10`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                                    {status.text}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                            <div className="rounded-lg bg-white/5 border border-white/10 px-1">
                                <CompetitionTimer
                                    startTime={competition.startTime}
                                    endTime={competition.endTime}
                                />
                            </div>
                            <div className="flex gap-3 w-full lg:w-auto">
                                {(status.text === 'Live' || status.text === 'Ended') && (
                                    <button
                                        onClick={handleSubmitCompetition}
                                        disabled={submitting}
                                        className="action-btn flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium whitespace-nowrap shadow-lg shadow-green-900/20"
                                    >
                                        {submitting ? (
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        )}
                                        {submitting ? 'Submitting...' : 'Submit Competition'}
                                    </button>
                                )}
                                <Link
                                    to={`/competitions/${competition._id}/leaderboard`}
                                    className="action-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-600/30 text-white rounded-lg text-sm font-medium whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                    View Leaderboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="anim-fade-up bg-[#12161f]/70 backdrop-blur-xl border border-white/10 rounded-xl p-6" style={{ animationDelay: '120ms' }}>
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.519-3.75L12 17.25m4.5-9.75h-3m1.5 0V3.104" /></svg>
                            Problems
                        </h2>
                        {problems.length === 0 && (
                            <p className="text-gray-500 text-sm">No problems added yet</p>
                        )}
                    </div>

                    {problems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {problems.map((problem, idx) => {
                                const attempts = mySubmissions.filter(s => s.problem?._id === problem._id);
                                const solved = attempts.some(s => s.status === 'accepted');
                                const statusText = attempts.length === 0 ? 'Not Attempted' : solved ? 'Solved' : 'Attempted';
                                const statusColor = attempts.length === 0 ? 'text-gray-400 bg-white/5 border-white/10' : solved ? 'text-green-300 bg-green-500/10 border-green-500/30' : 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
                                const diffMeta = DIFFICULTY_META[problem.difficulty] || { dot: 'bg-gray-400', text: 'text-gray-300', bg: 'bg-gray-500/10', border: 'border-gray-500/30' };
                                return (
                                    <Link
                                        key={problem._id}
                                        to={`/problems/${problem._id}`}
                                        className="problem-card anim-fade-up bg-black/20 border border-white/10 rounded-xl p-4 hover:border-cyan-500/40 group"
                                        style={{ animationDelay: `${idx * 60}ms` }}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                                {problem.title}
                                            </h3>
                                            {solved && (
                                                <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border capitalize ${diffMeta.bg} ${diffMeta.border} ${diffMeta.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                                                {problem.difficulty}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                                                {statusText}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2.5 line-clamp-2">
                                            {problem.description ? problem.description.substring(0, 100) + '...' : 'No description available'}
                                        </p>
                                        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
                                            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
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
                        <div className="text-center py-12 anim-fade-in">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
                                <svg className="relative w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 mb-4">No problems available yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompetitionDetails;
