
const apiUrl = (endpoint) => `http://localhost:4000/${endpoint}`;

// const getAssignments = async () => {
//     try {
//         const res = await fetch(apiUrl("assignments"));
//         const jsonData = await res.json();

//         const assignmentsPromises = jsonData.rows.map(async (assignment) => {
//             const queryRes = await getQuery(assignment.query_id);
//             const responseRes = await getResponse(assignment.response_id);
//             console.log("queryRes:", queryRes);

//             const query = queryRes.rows[0].query;
//             const response = responseRes.rows[0].response;
//             console.log("query:", query);

//             return {
//                 query,
//                 response
//             }
//         })

//         const assignmentsArr = await Promise.all(assignmentsPromises);
//         console.log("assignmentsArr", assignmentsArr)

//         return assignmentsArr;
//     } catch (error) {
//         console.error(error.message);
//         return { rows: [] };
//     }
// }

// const getQuery = async (queryId) => {
//     try {
//         console.log("query apiUrl:", apiUrl(`queries?id=${queryId}`));
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
    getAssignments,
    getQuery,
    getResponse,
    createQuery,
    deleteAll
}