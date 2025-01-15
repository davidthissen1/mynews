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
        <div>
            <h1>Your Personalized News Feed</h1>
            <button onClick={handleLogout}>Logout</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            
            <div>
            {articles.length > 0 ? (
                articles.map((article, index) => (
                    <ArticleCard key={article.url || index} article={article} />
                ))
            ) : (
                <p>No articles available.</p>
            )}
            </div>

               
        </div>
    );
};

export default NewsFeed;
