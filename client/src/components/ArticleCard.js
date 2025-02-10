import React, { useState } from "react";
import defaultImage from '../assets/news.jpeg'; // Add a default image
import './ArticleCard.css';


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
        <div className="news-card">
            <div className="news-card__image-container">
                <img
                    src={imageError ? defaultImage : (article.urlToImage || defaultImage)}
                    alt={article.title}
                    onError={() => setImageError(true)}
                    className="news-card__image"
                />
                <div className="news-card__overlay">
                    <span className="news-card__source">{article.source?.name}</span>
                </div>
            </div>
            <div className="news-card__content">
                <div className="news-card__meta">
                    <span className="news-card__date">
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="news-card__title">{article.title}</h3>
                <p className="news-card__description">{article.description}</p>
                <div className="news-card__actions">
                    <button
                        className={`action-btn ${like ? 'action-btn--liked' : ''}`}
                        onClick={handleLike}
                    >
                        <i className="bi bi-hand-thumbs-up"></i>
                        <span>Like</span>
                    </button>
                    <button
                        className={`action-btn ${dislike ? 'action-btn--disliked' : ''}`}
                        onClick={handleDislike}
                    >
                        <i className="bi bi-hand-thumbs-down"></i>
                        <span>Dislike</span>
                    </button>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn--read"
                    >
                        Read More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;