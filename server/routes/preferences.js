const express = require('express');
const pool = require('../db');
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

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

module.exports = router;