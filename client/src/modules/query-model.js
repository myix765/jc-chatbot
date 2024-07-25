
const apiUrl = "http://localhost:4000/queries"; // probably change to not be hardcoded here, put in .env?

const getQueries = async () => {
    try {
        const res = await fetch(apiUrl);
        const jsonData = await res.json();

        return jsonData;
    } catch (error) {
        console.error(error.message);
        return { rows: [] };
    }
}

const createQuery = async (query) => {
    try {
        const body = { query };
        const res = await fetch(apiUrl, {
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

export {
    getQueries,
    createQuery,
}