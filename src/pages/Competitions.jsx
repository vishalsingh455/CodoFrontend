import { useState, useEffect } from "react";
import CompetitionCard from "../components/CompetitionCard";
import api from "../services/api";

const Competitions = () => {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const res = await api.get("/user/all-competitions");
                // const res = await fetch("http://localhost:3000/api/user/all-competitions", {
                //     method: "GET",
                //     credentials: "include",
                //     headers: {
                //         "Authorization": `Bearer`,
                //         "Content-Type": "application/json"
                //     }
                // })
                // const result = await res.json()

                setCompetitions(res.data.competitions);
                console.log(res)
            } catch (error) {
                console.error("Error fetching competitions:", error);
            }
        };

        fetchCompetitions();
    }, []);

    return (
        <div className="bg-gray-950 min-h-screen p-8">
            <h2 className="text-3xl text-white font-bold mb-6">
                Active Competitions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitions.map((competition, idx) => (
                    <CompetitionCard
                        key={competition._id || idx}
                        competition={{
                            title: competition.title,
                            description: competition.description,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Competitions;
