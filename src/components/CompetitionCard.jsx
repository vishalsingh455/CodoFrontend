import {useNavigate} from "react-router-dom";
const CompetitionCard = ({ competition }) => {
    const navigate = useNavigate();
    const handleJoin = () => {
        // Logic to join the competition
        console.log(`Joining competition: ${competition.title}`);
        navigate('/join');

    }
    return (
        <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-xl text-indigo-400 font-semibold">
                {competition.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
                {competition.description}
            </p>

            <button onClick={handleJoin} className="mt-4 bg-green-600 px-4 py-2 rounded text-sm">
                Join Competition
            </button>
        </div>
    );
};

export default CompetitionCard;
