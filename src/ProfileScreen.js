import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BIN_ID = process.env.REACT_APP_USER_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

function ProfileScreen() {
    const navigate = useNavigate();
    const email = localStorage.getItem("userEmail");
    const username = localStorage.getItem("username");
    const [userData, setUserData] = useState(null);
    const [rankData, setRankData] = useState({});
    const [loading, setLoading] = useState(true);

    const categories = ["Programming", "Networking", "Database", "Operating Systems"];

    useEffect(() => {
        const fetchProfileAndRanks = async () => {
            try {
                const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY },
                });
                const data = await res.json();
                const users = data.record || [];

                // Find the current user
                const currentUser = users.find((u) => u.email === email);
                setUserData(currentUser || {});

                // 🏆 Calculate rank for each category
                const ranks = {};
                categories.forEach((cat) => {
                    const sorted = [...users].sort(
                        (a, b) => (b.scores?.[cat] || 0) - (a.scores?.[cat] || 0)
                    );
                    const position = sorted.findIndex((u) => u.email === email);
                    ranks[cat] = position === -1 ? "N/A" : position + 1;
                });

                setRankData(ranks);
            } catch (err) {
                console.error("⚠️ Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndRanks();
    }, [email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg text-gray-600">
                ⏳ Loading Profile...
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-red-600 text-lg mb-4">⚠️ User data not found.</p>
                <button
                    onClick={() => navigate("/start")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">👤 My Profile</h2>

                <div className="mb-6">
                    <p className="text-lg font-semibold">{username}</p>
                    <p className="text-gray-600">{email}</p>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Category-wise Performance</h3>
                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-purple-100">
                            <th className="border px-3 py-2">Category</th>
                            <th className="border px-3 py-2">Best Score</th>
                            <th className="border px-3 py-2">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat} className="hover:bg-gray-50">
                                <td className="border px-3 py-2 text-left">{cat}</td>
                                <td className="border px-3 py-2 text-center">
                                    {userData.scores?.[cat] ?? 0}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {rankData[cat] ?? "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Overall Stats */}
                <div className="text-gray-700 text-sm mb-6">
                    <p>Total Categories Played: {Object.keys(userData.scores || {}).length}</p>
                    <p>
                        Highest Score:{" "}
                        <span className="font-semibold text-blue-600">
                            {Math.max(...Object.values(userData.scores || { 0: 0 }))}
                        </span>
                    </p>
                </div>

                <button
                    onClick={() => navigate("/start")}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                    ⬅️ Back to Home
                </button>
            </div>
        </div>
    );
}

export default ProfileScreen;
