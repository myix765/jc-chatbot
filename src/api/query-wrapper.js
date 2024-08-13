
const apiUrl = (endpoint) => `/${endpoint}`;

const createTables = async () => {
    try {
        const res = await fetch(apiUrl("tables"), {
            method: "POST"
        });
        const jsonData = await res.json();
        return jsonData;
    } catch (error) {
        console.error(error);
    }
}

const getPairs = async () => {
    try {
        const res = await fetch(apiUrl("queries"));
        const jsonData = await res.json();

        // for every query get the corresponding response
        const queryPromises = jsonData.rows.map(async (queryData) => {
            const responseRes = await getResponse(queryData.response_id);
            // console.log("responseRes:", responseRes);

            const query = queryData.query;
            const response = responseRes.rows[0].response;
            // console.log("query:", query);

            return {
                query,
                response
            }
        })

        const pairArr = await Promise.all(queryPromises);
        // console.log("pairArrArr", pairArr)

        return pairArr;
    } catch (error) {
        console.error(error.message);
        return { rows: [] };
    }
}

// const getQuery = async (queryId) => {
//     try {
//         const res = await fetch(apiUrl(`queries?id=${queryId}`));
//         const jsonData = await res.json();

//         return jsonData;
//     } catch (error) {
//         console.error(error.message);
//     }
// }

const getResponse = async (responseId) => {
    try {
        const res = await fetch(apiUrl(`responses?id=${responseId}`));
        const jsonData = await res.json();

        return jsonData;
    } catch (error) {
        console.error(error.message);
    }
}

const createQuery = async (query) => {
    try {
        const body = { query };
        const res = await fetch(apiUrl("queries"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        const jsonData = await res.json();
        // console.log("createQuery:", jsonData);
        return jsonData;
    } catch (error) {
        console.error(error.message);
    }
}

const deleteAll = async () => {
    try {
        await fetch(apiUrl("queries"), {
            method: "DELETE"
        });
    } catch (error) {
        console.error(error.message);
    }
}

export {
    createTables,
    getPairs,
    getResponse,
    createQuery,
    deleteAll
}