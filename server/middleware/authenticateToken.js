const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authenticateToken;
