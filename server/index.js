const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Adjust path if needed
const newsRoutes = require('./routes/news');
const preferencesRoutes = require("./routes/news");
const interactionsRoutes = require('./routes/interactions');




const app = express();
const PORT = process.env.PORT || 5501;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Mount the Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.use("/api/preferences", preferencesRoutes);
app.use('/api/interactions', interactionsRoutes);



// Test Route
app.get('/', (req, res) => {
    res.send('MyNews Backend is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

