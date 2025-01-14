import React from "react";


const ArticleCard = ({ article }) => {
    const logInteraction = async (articleId, action) => {
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
        <div className="article-card">
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <button onClick={() => logInteraction(article.id, "like")}>Like</button>
            <button onClick={() => logInteraction(article.id, "dislike")}>Dislike</button>
            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logInteraction(article.id, "click")}
            >
                Read More
            </a>
        </div>
    );
};

export default ArticleCard;
