

// import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation
// import { useAuth } from '../context/auth'; // Custom hook to get user authentication state
// import { useState } from 'react'; // React hook for component state
// import api from '../services/api'; // API functions for making HTTP requests

// const Navbar = () => {
//     // Get authentication context (user info, loading state)
//     const authContext = useAuth();
//     const user = authContext?.user; // Current logged-in user data
//     const userName = authContext?.userName;
//     const loading = authContext?.loading; // Whether authentication is still loading
//     const navigate = useNavigate(); // Function to navigate to different pages
//     const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu open/closed

//     const handleLogout = async () => {
//         // Close the dropdown/mobile menu immediately so it doesn't visibly
//         // linger open while the logout request + navigate + reload happen.
//         setIsMenuOpen(false);
//         try {
//             await api.post('/auth/logout');
//             navigate('/');
//             window.location.reload();
//         } catch {
//             console.error('Logout failed');
//         }
//     };

//     if (loading) {
//         return (
//             <nav className="relative z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         <div className="flex-shrink-0">
//                             <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
//                                 Codo
//                             </div>
//                         </div>
//                         <div className="text-gray-400 text-sm">Loading...</div>
//                     </div>
//                 </div>
//             </nav>
//         );
//     }

//     return (
//         <nav className="relative z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700/50 backdrop-blur-sm">
//             <style>{`
//                 @keyframes navFadeScaleIn {
//                     from { opacity: 0; transform: translateY(-6px) scale(0.97); }
//                     to { opacity: 1; transform: translateY(0) scale(1); }
//                 }
//                 @keyframes navSlideDown {
//                     from { opacity: 0; transform: translateY(-8px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .nav-dropdown-anim { animation: navFadeScaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: top right; }
//                 .nav-mobile-anim { animation: navSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1) both; }
//                 @media (prefers-reduced-motion: reduce) {
//                     .nav-dropdown-anim, .nav-mobile-anim { animation: none !important; }
//                 }
//             `}</style>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Logo */}
//                     <div className="flex-shrink-0">
//                         <Link to="/" className="group flex items-center gap-2">
//                             <svg className="w-6 h-6 text-indigo-400 group-hover:text-pink-400 group-hover:rotate-6 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
//                             </svg>
//                             <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-pink-400 transition-all duration-300 group-hover:scale-105 inline-block">
//                                 Codo
//                             </div>
//                         </Link>
//                     </div>

//                     {/* Desktop Navigation */}
//                     <div className="hidden md:block">
//                         <div className="ml-10 flex items-baseline space-x-1">
//                             {user ? (
//                                 <>
//                                     <Link
//                                         to="/dashboard"
//                                         className="relative px-3 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
//                                     >
//                                         <div className="flex items-center gap-2">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
//                                             </svg>
//                                             Dashboard
//                                         </div>
//                                         <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
//                                     </Link>

//                                     <Link
//                                         to="/organizer"
//                                         className="relative px-3 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
//                                     >
//                                         <div className="flex items-center gap-2">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                             </svg>
//                                             Organizer
//                                         </div>
//                                         <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
//                                     </Link>

//                                     <Link
//                                         to="/join"
//                                         className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mr-2"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                                         </svg>
//                                         Join Competition
//                                     </Link>

//                                     <Link
//                                         to="/organizer/create"
//                                         className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                         </svg>
//                                         Create Competition
//                                     </Link>

//                                     {/* User Menu */}
//                                     <div className="relative ml-3">
//                                         <button
//                                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                             className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg"
//                                         >
//                                             <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-transparent hover:ring-indigo-400/40 transition-all duration-200">
//                                                 {userName?.charAt(0)?.toUpperCase() || 'U'}
//                                             </div>
//                                             <span className="hidden lg:block tracking-tight">{user.name}</span>
//                                             <svg className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                             </svg>
//                                         </button>

//                                         {isMenuOpen && (
//                                             <div className="nav-dropdown-anim absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-[60]">
//                                                 <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
//                                                     Signed in as <span className="text-white font-medium">{userName}</span>
//                                                 </div>
//                                                 <Link
//                                                     to="/report"
//                                                     onClick={() => setIsMenuOpen(false)}
//                                                     className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center gap-2"
//                                                 >
//                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
//                                                     </svg>
//                                                     Report a Bug
//                                                 </Link>
//                                                 <button
//                                                     onClick={handleLogout}
//                                                     className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
//                                                 >
//                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                                                     </svg>
//                                                     Logout
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Link
//                                         to="/"
//                                         className="relative px-4 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
//                                     >
//                                         Login
//                                         <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
//                                     </Link>
//                                     <Link
//                                         to="/register"
//                                         className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                                     >
//                                         Get Started
//                                     </Link>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Mobile menu button */}
//                     <div className="md:hidden">
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//                         >
//                             <svg className="block h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile menu */}
//             {isMenuOpen && (
//                 <div className="md:hidden nav-mobile-anim">
//                     <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
//                         {user ? (
//                             <>
//                                 <Link
//                                     to="/dashboard"
//                                     className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
//                                     </svg>
//                                     Dashboard
//                                 </Link>
//                                 <Link
//                                     to="/organizer"
//                                     className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     Organizer
//                                 </Link>
//                                 <Link
//                                     to="/join"
//                                     className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                                     </svg>
//                                     Join Competition
//                                 </Link>
//                                 <Link
//                                     to="/organizer/create"
//                                     className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                     </svg>
//                                     Create Competition
//                                 </Link>
//                                 <Link
//                                     to="/report"
//                                     className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
//                                     </svg>
//                                     Report a Bug
//                                 </Link>
//                                 <div className="border-t border-gray-600 pt-2 mt-2">
//                                     <div className="px-3 py-2 text-sm text-gray-400">
//                                         Signed in as <span className="text-white font-medium">{userName}</span>
//                                     </div>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                                         </svg>
//                                         Logout
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <>
//                                 <Link
//                                     to="/"
//                                     className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     Login
//                                 </Link>
//                                 <Link
//                                     to="/register"
//                                     className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md transition-colors duration-200"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     Get Started
//                                 </Link>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;

import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation
import { useAuth } from '../context/auth'; // Custom hook to get user authentication state
import { useState } from 'react'; // React hook for component state
import api from '../services/api'; // API functions for making HTTP requests

const Navbar = () => {
    // Get authentication context (user info, loading state)
    const authContext = useAuth();
    const user = authContext?.user; // Current logged-in user data
    const userName = authContext?.userName;
    const loading = authContext?.loading; // Whether authentication is still loading
    const navigate = useNavigate(); // Function to navigate to different pages
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu open/closed

    const handleLogout = async () => {
        // Close the dropdown/mobile menu immediately so it doesn't visibly
        // linger open while the logout request + navigate + reload happen.
        setIsMenuOpen(false);
        try {
            await api.post('/auth/logout');
            navigate('/');
            window.location.reload();
        } catch {
            console.error('Logout failed');
        }
    };

    if (loading) {
        return (
            <nav className="relative z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                Codo
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm">Loading...</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="relative z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700/50 backdrop-blur-sm">
            <style>{`
                @keyframes navFadeScaleIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes navSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-dropdown-anim { animation: navFadeScaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: top right; }
                .nav-mobile-anim { animation: navSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @media (prefers-reduced-motion: reduce) {
                    .nav-dropdown-anim, .nav-mobile-anim { animation: none !important; }
                }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="group flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-400 group-hover:text-pink-400 group-hover:rotate-6 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                            <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-pink-400 transition-all duration-300 group-hover:scale-105 inline-block">
                                Codo
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="relative px-3 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                            </svg>
                                            Dashboard
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                                    </Link>

                                    <Link
                                        to="/organizer"
                                        className="relative px-3 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Organizer
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                                    </Link>

                                    <Link
                                        to="/join"
                                        className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mr-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Join Competition
                                    </Link>

                                    <Link
                                        to="/organizer/create"
                                        className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Competition
                                    </Link>

                                    {/* User Menu — now hover-driven */}
                                    <div className="relative ml-3 group">
                                        <button
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg"
                                            aria-haspopup="true"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-transparent group-hover:ring-indigo-400/40 transition-all duration-200">
                                                {userName?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <span className="hidden lg:block tracking-tight">{user.name}</span>
                                            <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Invisible padding bridge keeps the hover area continuous
                                            between the button and the dropdown below it */}
                                        <div
                                            className="absolute right-0 top-full pt-2 w-52 z-[60]
                                                opacity-0 invisible scale-95 -translate-y-1
                                                group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0
                                                group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:translate-y-0
                                                transition-all duration-200 ease-out origin-top-right"
                                        >
                                            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                                                <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                                                    Signed in as <span className="text-white font-medium">{userName}</span>
                                                </div>
                                                <Link
                                                    to="/report"
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                                    </svg>
                                                    Report a Bug
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/"
                                        className="relative px-4 py-2 text-sm font-medium tracking-tight text-gray-300 hover:text-white transition-colors duration-200 group"
                                    >
                                        Login
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="relative px-4 py-2 text-sm font-medium tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <svg className="block h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden nav-mobile-anim">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link
                                    to="/organizer"
                                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Organizer
                                </Link>
                                <Link
                                    to="/join"
                                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Join Competition
                                </Link>
                                <Link
                                    to="/organizer/create"
                                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Competition
                                </Link>
                                <Link
                                    to="/report"
                                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                    Report a Bug
                                </Link>
                                <div className="border-t border-gray-600 pt-2 mt-2">
                                    <div className="px-3 py-2 text-sm text-gray-400">
                                        Signed in as <span className="text-white font-medium">{userName}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;