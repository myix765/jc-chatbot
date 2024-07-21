const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db_pool');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

// ENDPOINTS FOR QUERIES

// get all queries
app.get('/queries', async (req, res) => {
    try {
        const sqlQuery = "SELECT * FROM queries";
        const allQueries = await pool.query(
            sqlQuery
        );

        res.json(allQueries);
    } catch (e) {
        console.error(e.message);
    }
})

// insert query
app.post('/queries', async (req, res) => {
    try {
        const { query } = req.body;
        const sqlQuery = `INSERT INTO queries (query) VALUES ($1) RETURNING *`;
        const newQuery = await pool.query(
            sqlQuery,
            [query]
        );

        res.json(newQuery);
    } catch (e) {
        console.error(e.message);
    }
})

// delete all queries
app.delete('/queries', async (req, res) => {
    try {
        const sqlQuery = "DELETE FROM queries";
        const deleteQueries = await pool.query(
            sqlQuery
        )

        res.json(deleteQueries);
    } catch (e) {
        console.error(e.message);
    }
})