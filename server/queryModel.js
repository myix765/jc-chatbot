// import Pool from 'pg/Pool';
// import 'dotenv/config';

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.HOST,
//     database: process.env.DB,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

const pool = require('./db_pool');
console.log(pool);

const getQueries = async () => {
    try {
        const query = `SELECT * from queries`;

        return await new Promise(function (resolve, reject) {
            pool.query(
                query,
                (error, results) => {
                    if (error) { reject(error); }
                    if (results && results.rows) {
                        resolve(results.rows);
                    } else {
                        reject(new Error("No queries found"));
                    }
                }
            );
        });
    } catch (e) {
        console.error(e);
        throw new Error("Internal seerver error");
    }
}

const createQuery = (body) => {
    const query = `INSERT INTO queries (query) VALUES ($1) RETURNING *`;

    return new Promise(function (resolve, reject) {
        const { queryBody } = body;
        pool.query(
            query,
            [queryBody],
            (error, results) => {
                if (error) { reject(error); }
                if (results && results.rows) {
                    resolve(`Added query: ${JSON.stringify(results.rows[0])}`);
                } else {
                    reject(new Error("No results found"));
                }
            }
        );
    });
}

const deleteQuery = (id) => {
    const query = `DELETE FROM queries WHERE id=$1`;

    return new Promise(function (resolve, reject) {
        pool.query(
            query,
            [id],
            (error, results) => {
                if (error) { reject(error); }
                resolve(`Deleted query ID: ${id}`);
            }
        );
    });
}

const deleteAllQueries = () => {
    const query = "DELETE FROM queries";

    return new Promise(function (resolve, reject) {
        pool.query(
            query,
            (error, results) => {
                if (error) { reject(error); }
                resolve(`Deleted all rows`); // does results contian all the rows deleted
            }
        )
    })
}

module.exports = {
    getQueries,
    createQuery,
    deleteQuery,
    deleteAllQueries,
};