const content = document.getElementById("content")
content.innerHTML = `
<div class="login">
    <h1>Zone01</h1>
        <form  id="form">
            <input type="text"  placeholder="username/email" id="username">
            <input type="password"  placeholder="password" id="password">
            <span id="error"></span>
            <button type="submit">login</button>
        </form>
</div>
`
const form = document.getElementById("form")
const spanError = document.getElementById("error")
const loginApi = "https://learn.zone01oujda.ma/api/auth/signin"
const dataApi = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql"
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    error.innerHTML = ""
    if (username.vlaue === "" || password.value === "") {
        error.innerHTML = "empty data"
        return
    }
    let credentials = btoa(`${username.value}:${password.value}`)
    try {
        let respons = await fetch(loginApi, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({
                query: `{ user { id } }`
            })
        })
        if (!respons.ok) {
            throw new Error("invalid credentials");

        }

        const data = await respons.json();

        localStorage.setItem("token", data);



        Profile()
        console.log(111);

    } catch (error) {
        spanError.innerHTML = error
    }
})

async function Profile() {
    const jwt = localStorage.getItem("token")

    content.innerHTML = ""


    try {
        const response = await fetch(dataApi, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `{
  user {
    login
    firstName
    lastName
    totalUp
    totalDown
    level: transactions(
      where: {type: {_eq: "level"}, event: {object: {name: {_eq: "Module"}}}}
      order_by: {amount: desc}
      limit: 1
    ) {
      path
      createdAt
      amount
    }
  }
  totalXp: transaction_aggregate(
    where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  skills: user {
    transactions(
      where: {type: {_nin: ["xp", "level", "up", "down"]}}
      distinct_on: type
      order_by: {type: asc, amount: desc}
    ) {
      skillType: type
      skillAmount: amount
    }
  }
  audit  : 
  user {
    auditRatio
    sucess: audits_aggregate(where: {closureType: {_eq: succeeded}}) {
      aggregate {
        count
      }
    }
    failed: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate {
        count
      }
    }
  }
}

`
            })
        });

        if (!response.ok) {
            console.error("HTTP error:", response.status, await response.text());
            throw new Error('Unauthorized');
        }

        const data = await response.json();
       
        document.body.innerHTML = `
        <header id="header">
        <div id="welcom"><h1> welcom  ${data.data.user[0].lastName}   ${data.data.user[0].firstName}</h1></div>
        <div id="btn"><button id="logout">logOut</button></div>
         </header>

         <div class="container">
         <div class="></div>
         
         </div>
        `

    } catch (error) {
        console.log(error);

    }

}

