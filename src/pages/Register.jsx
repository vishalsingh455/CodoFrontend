// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../context/auth";

// const Register = () => {
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();
//     const { user, loading, refreshUser } = useAuth();

//     useEffect(() => {
//         if (!loading && user) {
//             navigate('/dashboard', { replace: true });
//         }
//     }, [loading, user, navigate]);

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             await api.post("/auth/register", { name, email, password });
//             await api.post("/auth/login", { email, password });
//             await refreshUser();
//             navigate('/dashboard', { replace: true });
//         } catch (error) {
//             setError(
//                 error.response?.data?.message || "Something went wrong"
//             );
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-950">
//             <form onSubmit={(e) => {
//                 handleRegister(e)
//             }} className="bg-gray-900 p-8 rounded-xl w-96 shadow-xl">
//                 <h2 className="text-2xl text-white font-bold mb-6 text-center">
//                     Register to Codo
//                 </h2>

//                 <input
//                     className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none"
//                     placeholder="Enter your username"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                 />

//                 <input
//                     className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <input
//                     type="password"
//                     className="w-full mb-6 px-4 py-2 rounded bg-gray-800 text-white outline-none"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
//                     Register
//                 </button>

//                 {error && (
//                     <p className="text-red-400 text-sm mb-3 text-center">
//                         {error}
//                     </p>
//                 )}
//             </form>
//         </div>
//     );
// };

// export default Register;






import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/auth";
import { ToastContainer, toast, Bounce } from "react-toastify";

const CODE_SNIPPET = `class User {
  constructor(name) {
    this.name = name;
    this.rank = "Unranked";
  }
}

> new User() created ✓`;

const CodeTypewriter = () => {
    const [typed, setTyped] = useState("");
    useEffect(() => {
        let i = 0;
        let deleting = false;
        let id;
        const tick = () => {
            if (!deleting) {
                i++;
                setTyped(CODE_SNIPPET.slice(0, i));
                if (i >= CODE_SNIPPET.length) {
                    id = setTimeout(() => { deleting = true; tick(); }, 1800);
                    return;
                }
                id = setTimeout(tick, 26);
            } else {
                i--;
                setTyped(CODE_SNIPPET.slice(0, i));
                if (i <= 0) {
                    id = setTimeout(() => { deleting = false; tick(); }, 500);
                    return;
                }
                id = setTimeout(tick, 10);
            }
        };
        tick();
        return () => clearTimeout(id);
    }, []);

    return (
        <div className="w-full rounded-xl bg-black/40 border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 text-[11px] text-gray-500 font-mono-ui">user.js</span>
            </div>
            <pre className="font-mono-ui text-[13px] leading-relaxed text-violet-300/90 p-5 min-h-[140px] whitespace-pre-wrap">
                {typed}
                <span className="inline-block w-1.5 h-4 bg-cyan-400 anim-blink align-middle ml-0.5" />
            </pre>
        </div>
    );
};

const LANGS = [
    { l: "JS", c: "from-yellow-400/20 text-yellow-300 border-yellow-400/30" },
    { l: "PY", c: "from-blue-400/20 text-blue-300 border-blue-400/30" },
    { l: "C++", c: "from-pink-400/20 text-pink-300 border-pink-400/30" },
    { l: "GO", c: "from-cyan-400/20 text-cyan-300 border-cyan-400/30" },
    { l: "RS", c: "from-orange-400/20 text-orange-300 border-orange-400/30" },
];

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, loading, refreshUser } = useAuth();

    // UI-only, no logic impact
    const [showPassword, setShowPassword] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        if (error) {
            setShake(true);
            const t = setTimeout(() => setShake(false), 500);
            return () => clearTimeout(t);
        }
    }, [error]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { name, email, password });
            await api.post("/auth/login", { email, password });
            await refreshUser();
            navigate('/dashboard', { replace: true });
            toast.success(' Registration Successful!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
        } catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    // purely visual, derived — does not gate submission
    const strength = (() => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    })();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];

    return (
        <div className="min-h-screen flex bg-[#0A0D14]">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes shakeX { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
                @keyframes floatSlow { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-12px,16px); } }
                @keyframes floatSlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(14px,-14px); } }
                @keyframes floatBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes gridPan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes shine { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(220%) skewX(-20deg); } }
                .anim-fade-up { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both; }
                .anim-fade-in { animation: fadeIn .5s ease both; }
                .anim-blink { animation: blink 1.1s step-end infinite; }
                .anim-shake { animation: shakeX .5s ease-in-out; }
                .anim-float-a { animation: floatSlow 10s ease-in-out infinite; }
                .anim-float-b { animation: floatSlow2 8s ease-in-out infinite; }
                .anim-float-badge { animation: floatBadge 3.5s ease-in-out infinite; }
                .bg-grid { background-image: linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px); background-size: 48px 48px; animation: gridPan 14s linear infinite; }
                .font-mono-ui { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace; }
                .gradient-border-wrap { position: relative; border-radius: 1rem; padding: 1.5px; }
                .gradient-border-wrap::before { content: ""; position: absolute; inset: -60%; background: conic-gradient(from 0deg, #22d3ee, #7c5cff, #22d3ee); animation: spin 5s linear infinite; }
                .gradient-border-wrap > .card-inner { position: relative; z-index: 1; border-radius: calc(1rem - 1.5px); }
                .btn-shine { position: relative; overflow: hidden; }
                .btn-shine::after { content: ""; position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent); transform: translateX(-120%) skewX(-20deg); }
                .btn-shine:hover::after { animation: shine .8s ease; }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up, .anim-fade-in, .anim-blink, .anim-shake, .anim-float-a, .anim-float-b, .anim-float-badge, .bg-grid, .gradient-border-wrap::before, .btn-shine:hover::after { animation: none !important; }
                }
            `}</style>

            {/* Left showcase panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 border-r border-white/5">
                <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <div className="absolute -top-20 -right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl anim-float-a" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl anim-float-b" />

                <div className="relative z-10 w-full max-w-md anim-fade-up">
                    <p className="font-mono-ui text-xs text-violet-400 tracking-widest mb-3">// CODO</p>
                    <h1 className="font-mono-ui text-4xl font-bold text-white leading-tight mb-4">
                        Join the
                        <br />
                        <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">CODO today.</span>
                    </h1>
                    <p className="text-gray-400 text-sm mb-8">
                        Create an account and start climbing the leaderboard in minutes.
                    </p>

                    <CodeTypewriter />

                    <div className="flex flex-wrap gap-2 mt-6">
                        {LANGS.map((b, i) => (
                            <span
                                key={b.l}
                                className={`anim-float-badge px-3 py-1 rounded-full text-xs font-mono-ui border bg-gradient-to-br ${b.c}`}
                                style={{ animationDelay: `${i * 0.4}s` }}
                            >
                                {b.l}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                        <div className="flex flex-col gap-1">
                            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584a6.062 6.062 0 01-.037-.666L6 18.72m12 0a5.97 5.97 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.682 2.72 9.094 9.094 0 003.742.479m.001-.031a5.97 5.97 0 01.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                            <p className="text-white font-semibold text-sm">12,482</p>
                            <p className="text-gray-500 text-[11px]">Active coders</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5M7.5 18.75v-4.5m4.5-4.5v9m0-9a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /></svg>
                            <p className="text-white font-semibold text-sm">850+</p>
                            <p className="text-gray-500 text-[11px]">Problems</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                            <p className="text-white font-semibold text-sm">Weekly</p>
                            <p className="text-gray-500 text-[11px]">Live contests</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30 lg:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <div className="absolute -bottom-24 -left-16 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl anim-float-b" />

                <div className="gradient-border-wrap anim-fade-up relative z-10 w-full max-w-sm">
                    <form
                        onSubmit={(e) => { handleRegister(e) }}
                        className="card-inner bg-[#12161f]/90 backdrop-blur-xl p-8"
                    >
                        <div className="flex flex-col items-center mb-7">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 blur-md opacity-40" />
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center font-mono-ui text-white font-bold text-lg shadow-lg">
                                    {'</>'}
                                </div>
                            </div>
                            <p className="font-mono-ui text-xs text-violet-400/80 tracking-wider"></p>
                            <h2 className="font-mono-ui text-2xl text-white font-bold mt-1 flex items-center gap-1">
                                Create account
                                <span className="inline-block w-2 h-5 bg-cyan-400 anim-blink translate-y-0.5" />
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="relative anim-fade-in" style={{ animationDelay: '80ms' }}>
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    id="reg-name"
                                    className="peer w-full pl-10 pr-4 pt-4 pb-1.5 rounded-lg bg-gray-800/70 border border-white/5 text-white outline-none placeholder-transparent transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                                    placeholder=" "
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="reg-name" className="absolute left-10 top-2.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-violet-400">
                                    Username
                                </label>
                            </div>

                            <div className="relative anim-fade-in" style={{ animationDelay: '140ms' }}>
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <input
                                    id="reg-email"
                                    className="peer w-full pl-10 pr-4 pt-4 pb-1.5 rounded-lg bg-gray-800/70 border border-white/5 text-white outline-none placeholder-transparent transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="reg-email" className="absolute left-10 top-2.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-violet-400">
                                    Email
                                </label>
                            </div>

                            <div className="anim-fade-in" style={{ animationDelay: '200ms' }}>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <input
                                        id="reg-password"
                                        type={showPassword ? "text" : "password"}
                                        className="peer w-full pl-10 pr-10 pt-4 pb-1.5 rounded-lg bg-gray-800/70 border border-white/5 text-white outline-none placeholder-transparent transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                                        placeholder=" "
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor="reg-password" className="absolute left-10 top-2.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-violet-400">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        )}
                                    </button>
                                </div>

                                {password.length > 0 && (
                                    <div className="mt-2 anim-fade-in">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strength ? strengthColor : 'bg-gray-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-1">{strengthLabel} password</p>
                                    </div>
                                )}
                            </div>

                            <button className="btn-shine w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group anim-fade-in" style={{ animationDelay: '260ms' }}>
                                Register
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </button>
                        </div>

                        <div className="mt-5 text-center text-sm">
                            <p className="text-gray-500">
                                Already have an account?{" "}
                                <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors" onClick={() => navigate('/')}>
                                    Log in
                                </span>
                            </p>
                        </div>

                        {error && (
                            <p className={`text-red-400 text-sm mt-4 text-center flex items-center justify-center gap-1.5 ${shake ? 'anim-shake' : ''}`}>
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                                {error}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
