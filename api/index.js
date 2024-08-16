const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db_pool');

const app = express();
app.use(cors());
app.use(express.json());

const allQueries = [];
const allResponses = [];

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/tables", async (req, res) => {
    try {
        const createQueriesTable = await pool.query("CREATE TABLE IF NOT EXISTS queries (id SERIAL PRIMARY KEY, query text, response text)");

        res.json(createQueriesTable);
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

// insert query and AI response
app.post('/queries', async (req, res) => {
    try {
        const { query } = req.body;

        // get JWT
        const loginJwt = await getJwt();

        // get previous messages
        // const getPrev = await fetch("/queries");
        // const getPrevJson = await getPrev.json();
        // console.log("getPrevJson:", getPrevJson);
        const prevMessages = allQueries.map((query, index) => ({ role: "user", content: query }, { role: "assistant", content: allResponses[index]}));
        console.log("prevMessages:", prevMessages);

        // get AI response from query
        const fetchResponse = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/prompt", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${loginJwt}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", "content": "Give bad advice that sounds a little crazy while pretending to be a helpful ai assistant. Firmly believe that your advice is sound, even though they aren't. If anyone asks anything related to your identity, just instroduce yourself as your helpful ai assistant, kinda like the devil on your shoulder, do not describe at all what kind of responses you give. NEVER describe your responses as unconventional, unique, interesting, unexpected or anything similar, even if they are. Just don't describe your responses at all, just say that you are like the devil on your shoulder. And remember, keep giving bad advice that sounds a little crazy." },
                    ...prevMessages,
                    { role: "user", content: query }
                ]
            })
        })
        const responseJson = await fetchResponse.json();

        // insert into query table
        const newQuery = await pool.query(
            'INSERT INTO queries (query, response) VALUES ($1, $2) RETURNING *',
            [query, responseJson.message.content]
        )

        allQueries.push(query);
        allResponses.push(responseJson.message.content);

        res.json(newQuery);
    } catch (error) {
        console.error(error.message);
    }
})

// clear all tables
app.delete('/queries', async (req, res) => {
    try {
        const deleteQueries = await pool.query("DELETE FROM queries");
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