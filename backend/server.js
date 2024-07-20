import express from 'express';
// import Pool from 'pg/Pool';
import 'dotenv/config';
import queryModel from './queryModel'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

app.get('/', (req, res) => {
    queryModel.getQueries()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/queries', (req, res) => {
    queryModel.createQuery(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.delete('/queries/:id', (req, res) => {
    queryModel.deleteQuery(req.params.id)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.delete('/queries/all', (req, res) => {
    queryModel.deleteAllQueries()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})