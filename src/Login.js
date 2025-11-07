import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BIN_ID = process.env.REACT_APP_USER_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY },
            });
            const data = await res.json();
            const users = data.record || [];
            const userFound = users.find(
                (u) => u.email === email && u.password === password
            );

            if (userFound) {
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", userFound.name || "Player");
                navigate("/start");
            } else {
                setErrorMsg("❌ Invalid Email or Password!");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("⚠️ Unable to connect. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-6">QuickQuiz Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* 🔗 Link to Register */}
                <p className="text-sm text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-indigo-600 font-medium underline cursor-pointer hover:text-indigo-800"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
