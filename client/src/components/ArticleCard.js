import React, { useState } from "react";
import defaultImage from '../assets/news.jpeg'; // Add a default image


const ArticleCard = ({ article }) => {
    const [imageError, setImageError] = useState(false);

    const [like, setLike] = useState(false); // Tracks the "Like" state
    const [dislike, setDislike] = useState(false); // Tracks the "Dislike" state
    
    const handleImageError = () => {
        setImageError(true);
    };

    const logInteraction = async (articleUrl, action) => {
        const token = localStorage.getItem("token");
        if (!articleUrl) return;
    
        try {
            await fetch("http://localhost:5501/api/interactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ articleUrl, action }),
            });
        } catch (err) {
            console.error("Error logging interaction:", err);
        }
    };

    const handleLike = () => {
        setLike(!like); // Toggle "Like" state
        if (!like) setDislike(false); // Reset "Dislike" if switching to "Like"
        logInteraction(article.url, "like");
    };

    const handleDislike = () => {
        setDislike(!dislike); // Toggle "Dislike" state
        if (!dislike) setLike(false); // Reset "Like" if switching to "Dislike"
        logInteraction(article.url, "dislike");
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