import React from "react";
import { useNavigate } from "react-router-dom";

function StartScreen() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Player";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-6 text-indigo-600">
                    Welcome, {username} 👋
                </h1>
                <p className="text-gray-600 mb-6">
                    Ready to test your skills? Choose an option below!
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                    {[
                        { label: "Start Quiz", path: "/categories" },
                        { label: "View Leaderboard", path: "/leaderboard" },
                        { label: "My Profile", path: "/profile" },
                    ].map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => navigate(btn.path)}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {btn.label}
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StartScreen;
