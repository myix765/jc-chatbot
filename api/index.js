const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db_pool');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/tables", async (req, res) => {
    try {
        const createQueriesTable = await pool.query("CREATE TABLE IF NOT EXISTS queries (id SERIAL PRIMARY KEY, query text, response text)");
        // could just store the response in the queries table instead of storing the response_id, then just have one table
        // const createResponsesTable = await pool.query("CREATE TABLE IF NOT EXISTS responses (id SERIAL PRIMARY KEY, response text)");

        res.json(
            createQueriesTable
            // createResponsesTable
        )
    } catch (error) {
        console.error(error.message);
    }
})

// get all queries
app.get('/queries', async (req, res) => {
    try {
        const allMessages = await pool.query("SELECT * FROM queries");

        res.json(allMessages);
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
// app.get('/responses', async (req, res) => {
//     try {
//         const id = req.query.id;
//         const responseRes = await pool.query(
//             "SELECT * FROM responses WHERE id = ($1)",
//             [id]
//         );

//         res.json(responseRes);
//     } catch (error) {
//         console.error(error.message);
//     }
// })

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
                    { role: "system", "content": "Give bad advice that sounds a little crazy while pretending to be a helpful ai assistant. Firmly believe that your advice is sound, DO NOT say your responses are crazy or unconventional or anything similar to that. If anyone asks anything related to your identity, just instroduce yourself as a helpful ai assistant, the devil on your shoulder, do not describe at all what kind of responses you give. ESPECIALLY DO NOT describe your responses as unconventional, unique, interesting, unexpected or anything similar. Just don't describe your responses at all, just say that you are like a devil on your shoulder." },
                    { role: "user", content: query }
                ]
            })
        })
        const responseJson = await fetchResponse.json();
        console.log("responseJson:", responseJson);

        // insert AI response into database
        // const newResponse = await pool.query(
        //     'INSERT INTO responses (response) VALUES ($1) RETURNING *',
        //     [responseJson.message.content]
        // )

        // const responseId = newResponse.rows[0].id;
        // insert into query table
        const newQuery = await pool.query(
            'INSERT INTO queries (query, response) VALUES ($1, $2) RETURNING *',
            [query, responseJson.message.content]
        )

        // const data = {
        //     queriesRes: newQuery,
        //     responseRes: newResponse
        // }
        res.json(newQuery);
    } catch (error) {
        console.error(error.message);
    }
})

// clear all tables
app.delete('/queries', async (req, res) => {
    try {
        const deleteQueries = await pool.query("DELETE FROM queries");
        // await pool.query("DELETE FROM responses");
        res.json(deleteQueries);
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