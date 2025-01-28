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
                // Redirect to login if no token is found
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5501/api/news", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Articles from API:", data);
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
        localStorage.removeItem("token"); // Clear the token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="container mt-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">Your Personalized News Feed</h1>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-danger">{error}</p>}

            {/* Articles */}
            <div className="row">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <div key={article.url || `unknown-${index}`} className="col-md-4 mb-4">
                            <ArticleCard
                                article={{
                                    ...article,
                                    id: article.id || article.url || `unknown-${index}`,
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p>No articles available.</p>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
