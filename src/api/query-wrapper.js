
const apiUrl = (endpoint) => `http://localhost:4000/${endpoint}`;

const getPairs = async () => {
    try {
        const res = await fetch(apiUrl("queries"));
        const jsonData = await res.json();

        const queryPromises = jsonData.rows.map(async (queryData) => {
            const responseRes = await getResponse(queryData.response_id);
            console.log("responseRes:", responseRes);

            const query = queryData.query;
            const response = responseRes.rows[0].response;
            console.log("query:", query);

            return {
                query,
                response
            }
        })

        const pairArr = await Promise.all(queryPromises);
        console.log("pairArrArr", pairArr)

        return pairArr;
    } catch (error) {
        console.error(error.message);
        return { rows: [] };
    }
}

const getQuery = async (queryId) => {
    try {
        console.log("query apiUrl:", apiUrl(`queries?id=${queryId}`));
        const res = await fetch(apiUrl(`queries?id=${queryId}`));
        const jsonData = await res.json();

        return jsonData;
    } catch (error) {
        console.error(error.message);
    }
}

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

        console.log(res);
        window.location = '/';
    } catch (error) {
        console.error(error.message);
    }
}

const deleteAll = async () => {
    try {
        await fetch(apiUrl("queries"), {
            method: "DELETE"
        });
        window.location = '/'; // not working
    } catch (error) {
        console.error(error.message);
    }
}

export {
    getQuery,
    getResponse,
    getPairs,
    createQuery,
    deleteAll
}