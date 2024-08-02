const Pool = require('pg').Pool;
require('dotenv').config;

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.HOST,
//     database: process.env.DB,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

module.exports = pool;