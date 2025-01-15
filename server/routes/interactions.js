const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Endpoint to log user interactions
router.post("/", authenticateToken, async (req, res) => {
    const { articleId, action } = req.body;
    const userId = req.user.id;
    console.log("Received interaction:", { userId, articleId, action });

    try {
        await pool.query(
            "INSERT INTO interactions (user_id, article_id, interaction_type) VALUES ($1, $2, $3)",
            [userId, articleId, action]
        );
        res.status(200).json({ message: "Interaction logged successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to log interaction" });
    }
});

module.exports = router;
