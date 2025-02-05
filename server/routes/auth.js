const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const pool = require("../db"); // Database connection
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");


const router = express.Router();

// Register User
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user into the database
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      // Generate JWT
      const token = jwt.sign(
        { user: { id: newUser.rows[0].id } },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Send token and success response
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.rows[0].id,
          username: newUser.rows[0].username,
          email: newUser.rows[0].email,
        },
        token, // Send token with the response
        redirect: "/select-interests", // Redirect to the interests page
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ user: { id: user.rows[0].id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/", authenticateToken, async (req, res) => {
    const { articleId, action } = req.body;
    const userId = req.user.id;

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
