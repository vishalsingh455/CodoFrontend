const ProblemCard = ({ problem }) => {
    const colors = {
        Easy: "text-green-400",
        Medium: "text-yellow-400",
        Hard: "text-red-400"
    };

    return (
        <div className="bg-gray-900 p-5 rounded-xl">
            <h3 className="text-white font-semibold">
                {problem.title}
            </h3>

            <span className={`text-sm ${colors[problem.difficulty]}`}>
                {problem.difficulty}
            </span>
        </div>
    );
};

export default ProblemCard;
