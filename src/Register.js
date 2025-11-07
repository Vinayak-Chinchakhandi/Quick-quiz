import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const BIN_ID = process.env.REACT_APP_USER_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    password: z
        .string()
        .min(3, "Minimum 4 characters")
        .max(6, "Maximum 6 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            "Must include a capital letter, number, and special symbol"
        ),
});

function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            const newErrors = {};
            result.error.issues.forEach(
                (err) => (newErrors[err.path[0]] = err.message)
            );
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setMessage("⌛ Saving data...");

        try {
            const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY },
            });
            const json = await res.json();
            const existingUsers = json.record || [];

            if (existingUsers.find((u) => u.email === formData.email)) {
                setMessage("⚠️ User already exists!");
                return;
            }

            const updated = [...existingUsers, formData];
            const save = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
                body: JSON.stringify(updated),
            });

            if (save.ok) {
                setMessage("✅ Registration successful!");
                setTimeout(() => navigate("/login"), 1200);
            } else {
                setMessage("❌ Failed to save data.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Network error while saving.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-6">Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name}</p>}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}

                    <input
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    {errors.mobile && <p className="text-red-600 text-sm mb-2">{errors.mobile}</p>}

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 font-medium underline cursor-pointer hover:text-indigo-800"
                    >
                        Login
                    </span>
                </p>

                {message && <p className="text-gray-700 mt-3 text-sm">{message}</p>}
            </div>
        </div>
    );
}

export default RegisterForm;
