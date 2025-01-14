const express = require('express');
const pool = require('../db'); // Database connection
const jwt = require('jsonwebtoken'); // To verify JWT
const router = express.Router();
const axios = require('axios');

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
    let token = req.header('Authorization');
    console.log("Received token:", token); // Log the token received by the backend
    if (!token) return res.status(401).json({ error: 'Access denied' });
     // Remove "Bearer " prefix if it exists
     if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft(); // Remove "Bearer " and trim whitespace
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user; // Add user info to request
        console.log("Token verified, user:", req.user); // Log verified user
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(400).json({ error: 'Invalid token' });
    }
};


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
        const articles = responses.flatMap((response) => response.data.articles);

        res.json(articles);
    } catch (err) {
        console.error("Error fetching news:", err.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

module.exports = router;
