import { useState } from "react";
import api from "../services/api";

const ReportBug = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setMessage("❌ Please fill in both the title and description.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await api.post("/reports", {
                title: title.trim(),
                description: description.trim()
            });

            setMessage("✅ Thank you! Your report has been submitted.");
            setTitle("");
            setDescription("");
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Failed to submit report. Please try again."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0D14] px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Report a Bug or Problem</h1>
                    <p className="text-gray-400 text-sm">
                        Found something not working right? Let us know and we'll look into it.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0F131C] border border-white/10 rounded-xl p-6 space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Briefly describe the issue"
                            className="w-full bg-gray-800/70 text-white px-4 py-2.5 rounded-lg border border-white/10 text-sm outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What happened? What did you expect to happen instead? Steps to reproduce, if any."
                            rows={6}
                            className="w-full bg-gray-800/70 text-white px-4 py-2.5 rounded-lg border border-white/10 text-sm outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-white font-semibold transition-all active:scale-95"
                    >
                        {loading ? "Submitting..." : "Submit Report"}
                    </button>

                    {message && (
                        <div className={`text-center p-3 rounded-lg text-sm font-medium border ${message.includes('✅')
                            ? 'bg-green-900/20 text-green-300 border-green-700/50'
                            : 'bg-red-900/20 text-red-300 border-red-700/50'
                            }`}>
                            {message.replace('✅ ', '').replace('❌ ', '')}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ReportBug;