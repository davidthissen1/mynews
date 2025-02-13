const { Pool } = require('pg'); // Import the Pool class
require('dotenv').config(); // Load environment variables

// Create a connection pool
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'dthissen', // Database username
    host: 'localhost', // Host
    database: process.env.POSTGRES_DB || 'mynews_database', // Database name
    password: process.env.POSTGRES_PASSWORD || 'Kashka1973', // Database password
    port: process.env.POSTGRES_PORT || 5432, // Default PostgreSQL port
});

// Export the pool for use in other files
module.exports = pool;
