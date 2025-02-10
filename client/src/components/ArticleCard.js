import React, { useState } from "react";
import defaultImage from '../assets/news.jpeg'; // Add a default image


const ArticleCard = ({ article }) => {
    const [imageError, setImageError] = useState(false);

    const [like, setLike] = useState(false); // Tracks the "Like" state
    const [dislike, setDislike] = useState(false); // Tracks the "Dislike" state
    const [currentInteraction, setCurrentInteraction] = useState(null);

    const handleImageError = () => {
        setImageError(true);
    };

    const logInteraction = async (articleUrl, action) => {
        const token = localStorage.getItem("token");
        if (!articleUrl) return;

        try {
            if (currentInteraction === action) {
                // If same action, remove the interaction
                setCurrentInteraction(null);
                await fetch("http://localhost:5501/api/interactions", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ articleUrl }),
                });
            } else {
                // New interaction
                setCurrentInteraction(action);
                await fetch("http://localhost:5501/api/interactions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ articleUrl, action }),
                });
            }
        } catch (err) {
            console.error("Error logging interaction:", err);
        }
    };
    const handleLike = () => {
        if (like) {
            setLike(false);
            setCurrentInteraction(null);
        } else {
            setLike(true);
            setDislike(false);
            logInteraction(article.url, "like");
        }
    };

    const handleDislike = () => {
        if (dislike) {
            setDislike(false);
            setCurrentInteraction(null);
        } else {
            setDislike(true);
            setLike(false);
            logInteraction(article.url, "dislike");
        }
    };

    return (
        <div className="card shadow-sm rounded-4 h-100">
            <div className="image-container">
                <img
                    src={imageError ? defaultImage : (article.urlToImage || defaultImage)}
                    className="card-img-top rounded-top-4"
                    alt={article.title}
                    onError={() => setImageError(true)}
                    style={{
                        height: '200px',
                        objectFit: 'cover',
                        width: '100%'
                    }}
                />
</div>
            <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className={`btn ${like ? "btn-success" : "btn-outline-success"} btn-sm d-flex align-items-center`}
                        onClick={handleLike}
                    >
                        <i className="bi bi-hand-thumbs-up me-2"></i> Like
                    </button>
                    <button
                        className={`btn ${dislike ? "btn-danger" : "btn-outline-danger"} btn-sm d-flex align-items-center`}
                        onClick={handleDislike}
                    >
                        <i className="bi bi-hand-thumbs-down me-2"></i> Dislike
                    </button>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        onClick={() => logInteraction(article.url, "click")}
                    >
                        Read More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;