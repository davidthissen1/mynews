const express = require('express');
const pool = require('../db'); // Database connection
const jwt = require('jsonwebtoken'); // To verify JWT
const router = express.Router();
const axios = require('axios');
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch disliked articles for the user using article_url
        const dislikedArticlesQuery = await pool.query(
            "SELECT article_url FROM interactions WHERE user_id = $1 AND interaction_type = 'dislike'",
            [userId]
        );
        const dislikedArticleUrls = dislikedArticlesQuery.rows.map((row) => row.article_url);

        // Fetch user preferences
        const preferences = await pool.query(
            "SELECT topic FROM preferences WHERE user_id = $1",
            [userId]
        );

        const categories = preferences.rows.map((row) => row.topic);
        const allCategories = [...categories, "general"]; // Include fallback category

        // Call NewsAPI for each category
        const apiKey = process.env.NEWS_API_KEY;
        const promises = allCategories.map((category) =>
            axios.get(`https://newsapi.org/v2/top-headlines`, {
                params: {
                    category,
                    apiKey,
                    country: 'us'
                }
            })
        );

        const responses = await Promise.all(promises);
        
        // Filter out disliked articles by URL
        const articles = responses
            .flatMap(response => response.data.articles)
            .filter(article => !dislikedArticleUrls.includes(article.url));

        res.json(articles);
    } catch (err) {
        console.error("Error fetching news:", err);
        res.status(500).json({ error: "Error fetching news" });
    }
});






router.post("/", authenticateToken, async (req, res) => {
    const { userId, articleUrl, action } = req.body;
    
    try {
        await pool.query(
            "INSERT INTO interactions (user_id, article_url, interaction_type) VALUES ($1, $2, $3)",
            [userId, articleUrl, action]
        );
        res.status(200).json({ message: "Interaction logged successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to log interaction" });
    }
});

module.exports = router;
