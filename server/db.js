const { Pool } = require('pg'); // Import the Pool class from pg module
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.POSTGRES_USER,     // Postgres username
    host: 'localhost',                  // Host of the database
    database: process.env.POSTGRES_DB,  // Database name
    password: process.env.POSTGRES_PASSWORD, // Postgres password
    port: process.env.POSTGRES_PORT,    // Port (default: 5432)
});

module.exports = pool; // Export the pool object
