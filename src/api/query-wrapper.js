
const apiUrl = (endpoint) => `/${endpoint}`;

const createTables = async () => {
    try {
        const res = await fetch(apiUrl("tables"), {
            method: "POST"
        });
        const jsonData = await res.json();
        return jsonData;
    } catch (error) {
        console.error(error.message);
    }
}

const getAllQueries = async () => {
    try {
        const res = await fetch(apiUrl("queries"));
        const jsonData = await res.json();

        return jsonData.rows;
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
    getAllQueries,
    createQuery,
    deleteAll
}