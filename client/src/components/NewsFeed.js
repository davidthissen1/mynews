import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "./ArticleCard"; // Ensure correct path to ArticleCard

const NewsFeed = () => {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5501/api/news", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || "Failed to fetch news");
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("An error occurred. Please try again.");
            }
        };

        fetchNews();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="text-primary fw-bold">Your Personalized News Feed</h1>
                <button className="btn btn-danger px-4 py-2" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-danger">{error}</p>}

            {/* Articles */}
            <div className="row gy-4">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <div key={index} className="col-lg-4 col-md-6">
                            <ArticleCard article={article} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">No articles available.</p>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
