import React from "react";
import { useNavigate } from "react-router-dom";

function CategorySelectScreen() {
    const navigate = useNavigate();

    // Category definitions with icons and colors
    const categories = [
        { name: "Programming", color: "bg-blue-600 hover:bg-blue-700", icon: "💻" },
        { name: "Networking", color: "bg-green-600 hover:bg-green-700", icon: "🌐" },
        { name: "Database", color: "bg-purple-600 hover:bg-purple-700", icon: "🗄️" },
        { name: "Operating Systems", color: "bg-orange-600 hover:bg-orange-700", icon: "⚙️" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-purple-700">🧠 Choose a Category</h2>
                <p className="text-gray-500 mb-6">Select one to start your quiz!</p>

                <div className="space-y-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => navigate(`/quiz?category=${cat.name}`)}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}

                </div>

                <button
                    onClick={() => navigate("/start")}
                    className="mt-8 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition w-full"
                >
                    ⬅️ Back to Home
                </button>
            </div>
        </div>
    );
}

export default CategorySelectScreen;
