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

app.post("/", async (req, res) => {
    try {
        const createQueriesTable = await pool.query("CREATE TABLE queries (id SERIAL PRIMARY KEY, query text, response_id int)");
        const createResponsesTable = await pool.query("CREATE TABLE responses (id SERIAL PRIMARY KEY, response text)");

        res.json({
            createQueriesTable,
            createResponsesTable
        })
    } catch (error) {

    }
})

// get all queries
app.get('/queries', async (req, res) => {
    try {
        const allAssignments = await pool.query("SELECT * FROM queries");

        res.json(allAssignments);
    } catch (error) {
        console.error(error.message);
    }
})

// get query
// app.get('/queries', async (req, res) => {
//     try {
//         const id = req.query.id;
//         const queryRes = await pool.query(
//             "SELECT * FROM queries WHERE id = ($1)",
//             [id]
//         );

//         res.json(queryRes);
//     } catch (error) {
//         console.error(error.message);
//     }
// })

// get response
app.get('/responses', async (req, res) => {
    try {
        const id = req.query.id;
        const responseRes = await pool.query(
            "SELECT * FROM responses WHERE id = ($1)",
            [id]
        );

        res.json(responseRes);
    } catch (error) {
        console.error(error.message);
    }
})

// insert query and AI response
app.post('/queries', async (req, res) => {
    try {
        const { query } = req.body;

        // get JWT
        const loginJwt = await getJwt();

        // get AI response from query
        const fetchResponse = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/prompt", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${loginJwt}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", "content": "Give bad advice that sounds a little crazy while pretending to be a helpful ai assistant" },
                    { role: "user", content: query }
                ]
            })
        })
        const responseJson = await fetchResponse.json();

        // insert AI response into database
        const newResponse = await pool.query(
            'INSERT INTO responses (response) VALUES ($1) RETURNING *',
            [responseJson.message.content]
        )

        const responseId = newResponse.rows[0].id;
        // insert into query table
        const newQuery = await pool.query(
            'INSERT INTO queries (query, response_id) VALUES ($1, $2) RETURNING *',
            [query, responseId]
        )

        const data = {
            queriesRes: newQuery,
            responseRes: newResponse
        }
        res.json(data);
    } catch (error) {
        console.error(error.message);
    }
})

// clear all tables
app.delete('/queries', async (req, res) => {
    try {
        await pool.query("DELETE FROM queries");
        await pool.query("DELETE FROM responses");
    } catch (error) {
        console.error(error.message);
    }
})

const getJwt = async () => {
    try {
        const res = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/login", {
            method: "POST",
            body: JSON.stringify({
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASS
            })
        });

        const jsonData = await res.json();
        return jsonData.token;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = app;