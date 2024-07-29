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

// get all query-response pairs
app.get('/assignments', async (req, res) => {
    try {
        const allAssignments = await pool.query("SELECT * FROM query_response");

        res.json(allAssignments);
    } catch (error) {
        console.error(error.message);
    }
})

// get query
app.get('/queries', async (req, res) => {
    try {
        const id = req.query.id;
        const queryRes = await pool.query(
            "SELECT * FROM queries WHERE id = ($1)",
            [id]
        );

        res.json(queryRes);
    } catch (error) {
        console.error(error.message);
    }
})

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
        // insert query into database
        const { query } = req.body;
        const newQuery = await pool.query(
            `INSERT INTO queries (query) VALUES ($1) RETURNING *`,
            [query]
        );

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
                    { role: "system", "content": "Today is opposite day." },
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

        const queryId = newQuery.rows[0].id;
        const responseId = newResponse.rows[0].id;
        // insert into assignment table
        const newAssignment = await pool.query(
            'INSERT INTO query_response (query_id, response_id) VALUES ($1, $2) RETURNING *',
            [queryId, responseId]
        )

        const data = {
            queriesRes: newQuery,
            responseRes: newResponse,
            assignmentRes: newAssignment
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
        await pool.query("DELETE FROM query_response");
        await pool.query("DELETE FROM responses");
    } catch (error) {
        console.error(error.message);
    }
})

// app.post('/auth', async (req, res) => {
//     try {
//         const loginRes = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/login", {
//             method: "POST",
//             body: JSON.stringify({
//                 username: "megan",
//                 password: "Opportunity-Split5-Certainly"
//             })
//         });

//         const loginResJson = await loginRes.json();
//         res.json(loginResJson);
//     } catch (error) {
//         console.error(error.message)
//     }
// })

const getJwt = async () => {
    try {
        const res = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/login", {
            method: "POST",
            body: JSON.stringify({
                username: "megan",
                password: "Opportunity-Split5-Certainly"
            })
        });

        const jsonData = await res.json();
        return jsonData.token;
    } catch (error) {
        console.error(error.message);
    }
}