const express = require('express');
const pool = require('../db'); // Database connection
const jwt = require('jsonwebtoken'); // To verify JWT
const router = express.Router();
const axios = require('axios');
const authenticateToken = require("../middleware/authenticateToken");


router.post("/", authenticateToken, async (req, res) => {
    const { interests } = req.body;
    const userId = req.user.id;

    console.log("User ID:", userId); // Log the user ID
    console.log("Interests:", interests); // Log the interests array

    if (!Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({ error: "Invalid preferences data." });
    }

    try {
        // Delete existing preferences
        await pool.query("DELETE FROM preferences WHERE user_id = $1", [userId]);
        console.log("Existing preferences deleted for user:", userId);

        // Insert new preferences
        const insertPromises = interests.map((interest) =>
            pool.query("INSERT INTO preferences (user_id, topic) VALUES ($1, $2)", [userId, interest])
        );

        await Promise.all(insertPromises);
        console.log("Preferences saved successfully for user:", userId);

        res.status(200).json({ message: "Preferences saved successfully" });
    } catch (err) {
        console.error("Error saving preferences:", err.message);
        res.status(500).json({ error: "Failed to save preferences" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch user preferences from the database
        const preferences = await pool.query(
            "SELECT topic FROM preferences WHERE user_id = $1",
            [userId]
        );

        const categories = preferences.rows.map((row) => row.topic);
        if (categories.length === 0) {
            return res.status(400).json({ error: "No preferences set for this user." });
        }

        // Call NewsAPI for each category
        const apiKey = process.env.NEWS_API_KEY;
        const promises = categories.map((category) =>
            axios.get(`https://newsapi.org/v2/top-headlines`, {
                params: {
                    category,
                    apiKey,
                    language: "en",
                    pageSize: 5, // Limit results per category
                },
            })
        );

        const responses = await Promise.all(promises);

        // Combine news articles from all categories
        const articles = responses.flatMap((response) =>
            response.data.articles.map((article, index) => ({
                ...article,
                id: article.id || article.url || `unknown-${index}`,
            }))
        );
        
        
        res.json(articles);
    } catch (err) {
        console.error("Error fetching news:", err.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

router.post("/interactions", authenticateToken, async (req, res) => {
    const { articleId, action } = req.body; // Action: "click", "like", "dislike"
    const userId = req.user.id;

    try {
        await pool.query(
            "INSERT INTO interactions (user_id, article_id, action) VALUES ($1, $2, $3)",
            [userId, articleId, action]
        );
        res.status(200).json({ message: "Interaction logged" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to log interaction" });
    }
});

module.exports = router;
