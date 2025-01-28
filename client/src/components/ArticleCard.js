import React from "react";

const ArticleCard = ({ article }) => {
    const logInteraction = async (articleId, action) => {
        if (!articleId) {
            console.error("Invalid articleId:", articleId);
            return;
        }

        console.log("Logging interaction:", "articleId=", articleId, ", action=", action);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5501/api/interactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ articleId, action }),
            });

            if (!response.ok) {
                console.error("Failed to log interaction");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="card shadow-sm h-100">
            {/* Article Image */}
            {article.image && (
                <img
                    src={article.image}
                    className="card-img-top"
                    alt="Article"
                    style={{ height: "200px", objectFit: "cover" }}
                />
            )}

            <div className="card-body d-flex flex-column">
                {/* Article Title */}
                <h5 className="card-title text-dark">{article.title}</h5>

                {/* Article Summary */}
                <p className="card-text text-secondary">
                    {article.summary || "No summary available."}
                </p>

                {/* Interaction Buttons */}
                <div className="mt-auto">
                    <button
                        className="btn btn-outline-success me-2"
                        onClick={() => logInteraction(article.id, "like")}
                    >
                        Like
                    </button>
                    <button
                        className="btn btn-outline-danger me-2"
                        onClick={() => logInteraction(article.id, "dislike")}
                    >
                        Dislike
                    </button>
                    <a
                        href={article.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
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
