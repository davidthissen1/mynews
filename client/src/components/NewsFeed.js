import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "./ArticleCard"; // Ensure correct path to ArticleCard
import './NewsFeed.css';

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
        <div className="news-feed-container">
            <nav className="nav-bar">
                <h1 className="nav-title">MyNews</h1>
                <button onClick={handleLogout} className="logout-btn">
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </nav>
            <div className="news-feed">
                {articles.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
