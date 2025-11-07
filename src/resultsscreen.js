import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BIN_ID = process.env.REACT_APP_USER_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

function ResultScreen() {
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(true);
    const [status, setStatus] = useState("");
    const [quizResult, setQuizResult] = useState(null);

    const email = localStorage.getItem("userEmail");

    // ✅ Load quiz result safely
    useEffect(() => {
        const stored = localStorage.getItem("quizDetails");
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log("🧾 Loaded quizDetails:", parsed);
            setQuizResult(parsed);
        } else {
            console.warn("⚠️ No quizDetails found in localStorage");
        }
    }, []);

    // ✅ Update user's best score once quizResult is ready
    useEffect(() => {
        const updateUserScore = async () => {
            if (!quizResult) return; // Wait until data is loaded

            const { category, score } = quizResult;

            if (!email || !category) {
                setStatus("⚠️ Missing user or category info.");
                setUpdating(false);
                return;
            }

            try {
                // Fetch users from JSONBin
                const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY },
                });
                const data = await res.json();
                const users = data.record || [];

                const userIndex = users.findIndex((u) => u.email === email);
                if (userIndex === -1) {
                    setStatus("⚠️ User not found in database.");
                    setUpdating(false);
                    return;
                }

                const user = users[userIndex];
                if (!user.scores) user.scores = {};

                // Update if score improved
                const prevBest = user.scores[category] || 0;
                if (score > prevBest) {
                    user.scores[category] = score;
                    users[userIndex] = user;

                    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Master-Key": MASTER_KEY,
                        },
                        body: JSON.stringify(users),
                    });
                    setStatus("✅ New high score saved successfully!");
                } else {
                    setStatus("ℹ️ You did not beat your previous best score.");
                }
            } catch (err) {
                console.error("❌ Failed to update score:", err);
                setStatus("❌ Failed to update score in database.");
            } finally {
                setUpdating(false);
                // ✅ Don’t remove quizDetails immediately — keep for analysis display
            }
        };

        updateUserScore();
    }, [quizResult, email]);

    // ✅ Handle missing result
    if (!quizResult) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-red-600 text-lg mb-4">⚠️ No quiz result found.</p>
                <button
                    onClick={() => navigate("/start")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const { category, score, userAnswers = [] } = quizResult;

    if (updating) {
        return (
            <div className="flex items-center justify-center h-screen text-lg text-gray-600">
                ⏳ Saving your results...
            </div>
        );
    }

    // ✅ Display final results
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg text-center">
                <h2 className="text-3xl font-bold mb-3">🎉 Quiz Completed!</h2>
                <p className="text-lg mb-1">
                    Category:{" "}
                    <span className="font-semibold text-purple-700">{category}</span>
                </p>
                <p className="text-lg mb-3">
                    Your Score:{" "}
                    <span className="font-semibold text-blue-600">{score}</span>
                </p>
                <p className="text-green-600 font-medium mb-4">{status}</p>

                {/* ✅ Question analysis */}
                <div className="text-left bg-gray-50 p-4 rounded-lg mb-5 max-h-64 overflow-y-auto">
                    <h3 className="font-bold text-gray-700 mb-2">📊 Question Analysis</h3>
                    {userAnswers.length > 0 ? (
                        userAnswers.map((qa, i) => (
                            <div key={i} className="mb-3 border-b pb-2">
                                <p className="font-semibold text-gray-700">
                                    {i + 1}. {qa.question}
                                </p>
                                <p className="text-sm">
                                    Your Answer:{" "}
                                    <span className="text-blue-600">{qa.userAnswer}</span>
                                </p>
                                <p className="text-sm">
                                    Correct Answer:{" "}
                                    <span className="text-green-600">{qa.answer}</span>
                                </p>
                                <p
                                    className={`text-sm font-semibold ${qa.isCorrect ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {qa.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No answers recorded.</p>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/leaderboard")}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        🏆 View Leaderboard
                    </button>
                    <button
                        onClick={() => navigate("/start")}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                    >
                        🏠 Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ResultScreen;
