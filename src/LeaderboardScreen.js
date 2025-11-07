import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BIN_ID = process.env.REACT_APP_USER_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Programming");
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userEmail");

  const categories = ["Programming", "Networking", "Database", "Operating Systems"];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: { "X-Master-Key": MASTER_KEY },
        });
        const data = await res.json();
        const usersData = data.record || [];

        // ✅ Filter out invalid or empty placeholder objects
        const validUsers = usersData.filter(
          (u) =>
            u &&
            typeof u === "object" &&
            Object.keys(u).length > 0 &&
            u.email &&
            u.name
        );

        setUsers(validUsers);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  // 🧠 Sort by selected category (descending)
  const sortedUsers = [...users].sort(
    (a, b) => (b.scores?.[selectedCategory] || 0) - (a.scores?.[selectedCategory] || 0)
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">🏆 Leaderboard</h2>

        {/* Category Selector */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 font-semibold text-gray-700 border-b pb-2 mb-2 text-sm">
          <span>Rank</span>
          <span>Name</span>
          <span>Score</span>
        </div>

        {/* Leaderboard Entries */}
        <ul className="text-gray-800 text-sm">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((u, index) =>
              u.name && u.email ? (
                <li
                  key={u.email || index}
                  className={`grid grid-cols-3 py-2 border-b ${
                    u.email === currentUser ? "bg-yellow-100 font-semibold" : ""
                  }`}
                >
                  <span>{index + 1}</span>
                  <span>{u.name}</span>
                  <span>{u.scores?.[selectedCategory] || 0}</span>
                </li>
              ) : null
            )
          ) : (
            <p className="text-gray-500 text-sm py-3">No players found.</p>
          )}
        </ul>

        <button
          onClick={() => navigate("/start")}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
}

export default LeaderboardScreen;
