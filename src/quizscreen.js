import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const BIN_ID = process.env.REACT_APP_QUESTIONS_BIN_ID;
const MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY;

function QuizScreen() {
    const [searchParams] = useSearchParams();
    const category = decodeURIComponent(searchParams.get("category") || "Unknown"); // ✅ Decode and set default
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timer, setTimer] = useState(15);
    const navigate = useNavigate();

    // ✅ Fetch category questions
    useEffect(() => {
        const fetchCategoryQuestions = async () => {
            try {
                const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY },
                });
                const data = await res.json();

                const categoriesData = data.record.categories || data.record[0]?.categories;
                if (!categoriesData || !categoriesData[category]) {
                    console.error("❌ Category not found:", category);
                    throw new Error("Category not found");
                }

                console.log("✅ Loaded category:", category);
                setQuestions(categoriesData[category]);
            } catch (err) {
                console.error("❌ Error fetching questions:", err);
                setError("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryQuestions();
    }, [category]);

    // ✅ Reset timer each question
    useEffect(() => {
        setTimer(15);
    }, [currentQuestion]);

    // ✅ Countdown timer
    useEffect(() => {
        if (timer === 0) handleNext();
        const countdown = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const handleNext = () => {
        if (!questions.length) return;

        const q = questions[currentQuestion];
        const isCorrect = selectedOption === q.answer;

        const newAnswer = {
            question: q.question,
            userAnswer: selectedOption || "No answer",
            answer: q.answer,
            isCorrect,
        };

        const updatedAnswers = [...userAnswers, newAnswer];
        const newScore = isCorrect ? score + 1 : score;

        if (currentQuestion + 1 < questions.length) {
            setUserAnswers(updatedAnswers);
            setScore(newScore);
            setSelectedOption("");
            setCurrentQuestion((prev) => prev + 1);
        } else {
            // ✅ Finalize and store accurate result
            const finalResult = {
                category: category.trim(),
                score: newScore,
                userAnswers: updatedAnswers,
            };

            console.log("✅ FINAL QUIZ RESULT:", finalResult);

            // Save to localStorage
            localStorage.setItem("quizDetails", JSON.stringify(finalResult));

            // Small delay to ensure data is saved
            setTimeout(() => navigate("/results"), 300);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen text-lg text-gray-600">
                ⏳ Loading Questions...
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-600">
                {error}
                <button
                    onClick={() => navigate("/start")}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );

    const q = questions[currentQuestion];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => navigate("/start")}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                        Quit
                    </button>
                    <span className="font-semibold text-red-500">⏱ {timer}s</span>
                </div>

                <h2 className="text-xl font-bold mb-4">{q.question}</h2>

                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full border py-2 px-3 rounded-lg mb-2 ${selectedOption === opt
                            ? "bg-blue-100 border-blue-400"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        {opt}
                    </button>
                ))}

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleNext}
                        disabled={!selectedOption && timer > 0}
                        className={`px-5 py-2 rounded-lg w-full mt-3 ${selectedOption
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default QuizScreen;
