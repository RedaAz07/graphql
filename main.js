const credentials = btoa("ranniz:R1e23da4@anniz")
fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `{ user { id } }`
    })
}).then((r) => {
    console.log(r);

})



