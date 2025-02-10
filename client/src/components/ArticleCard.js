import React, { useState } from "react";

const ArticleCard = ({ article }) => {
    const [like, setLike] = useState(false); // Tracks the "Like" state
    const [dislike, setDislike] = useState(false); // Tracks the "Dislike" state

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
            {/* Article Image */}
            {article.image && (
                <img
                    src={article.image}
                    className="card-img-top rounded-top-4"
                    alt="Article"
                    style={{ height: "200px", objectFit: "cover" }}
                />
            )}

            <div className="card-body d-flex flex-column">
                {/* Title */}
                <h5 className="card-title text-dark">{article.title}</h5>

                {/* Summary */}
                <p className="card-text text-secondary">
                    {article.summary || "No summary available."}
                </p>

                {/* Buttons */}
                <div className="mt-auto d-flex justify-content-between">
                    {/* Like Button */}
                    <button
                        className={`btn ${like ? "btn-success" : "btn-outline-success"} btn-sm d-flex align-items-center`}
                        onClick={handleLike}
                    >
                        <i className="bi bi-hand-thumbs-up me-2"></i> Like
                    </button>

                    {/* Dislike Button */}
                    <button
                        className={`btn ${dislike ? "btn-danger" : "btn-outline-danger"} btn-sm d-flex align-items-center`}
                        onClick={handleDislike}
                    >
                        <i className="bi bi-hand-thumbs-down me-2"></i> Dislike
                    </button>

                    {/* Read More Link */}
                    <a
                        href={article.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        onClick={() => logInteraction(article.id, "click")}
                    >
                        Read More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
