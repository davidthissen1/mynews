const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Endpoint to log user interactions
router.post("/", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get userId from auth token

    const { articleUrl, action } = req.body;
    
    console.log("Received interaction:", { userId, articleUrl, action });

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
// Get user's interactions
router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            "SELECT * FROM interactions WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch interactions" });
    }
});
// Delete an interaction
router.delete("/:id", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        await pool.query(
            "DELETE FROM interactions WHERE id = $1 AND user_id = $2",
            [id, userId]
        );
        res.json({ message: "Interaction deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete interaction" });
    }
});
// Get interaction statistics
router.get("/stats", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT interaction_type, COUNT(*) 
             FROM interactions 
             WHERE user_id = $1 
             GROUP BY interaction_type`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch interaction stats" });
    }
});
module.exports = router;

