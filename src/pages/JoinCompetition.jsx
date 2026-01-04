import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JoinCompetition = () => {
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!roomCode.trim()) {
            setError('Room code is required');
            return;
        }

        try {
            setLoading(true);
            
            const response = await api.post('/competitions/join', {
                roomCode: roomCode.trim()
            });
            
            setSuccess('Successfully joined the competition!');
            setTimeout(() => {
                navigate(`/competitions/${response.data.competitionId}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join competition');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-4">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Join Competition
                    </h1>
                    <p className="text-gray-400">
                        Enter the room code to join an existing competition
                    </p>
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Room Code
                        </label>
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            placeholder="Enter room code"
                            maxLength={6}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                            <p className="text-green-400 text-sm">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Joining...
                            </div>
                        ) : (
                            'Join Competition'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have a room code?{' '}
                        <button 
                            onClick={() => navigate('/organizer')}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Create your own competition
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinCompetition;
