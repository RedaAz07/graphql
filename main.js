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
    firstName
    lastName
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
  audit  : user {
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

    let data = await response.json();
    data = data.data
    const user = data.user[0];

    const totalXp = data.totalXp.aggregate.sum.amount;
    const level = user.level[0]?.amount || 0;

    const success = data.audit[0].sucess.aggregate.count;
    const failed = data.audit[0].failed.aggregate.count;
    const totalAudits = success + failed;
    const auditRatio = data.audit.auditRatio;


    const skills = data.skills[0].transactions;

    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    const successLength = (success / totalAudits) * circumference;
    const failedLength = (failed / totalAudits) * circumference;


    document.body.innerHTML = `
<header id="header">
  <div id="welcom">
    <h1>Welcome ${user.firstName} ${user.lastName}</h1>
  </div>
  <div id="btn"><button id="logout">logOut</button></div>
</header>

<div class="container">
  <div class="info">
    <div class="xp">
      Total xp
      <span>${(totalXp / 1000).toFixed(1)}KB</span>
    </div>
    <div class="level">
      current level
      <div class="level-cr">${level}</div>
    </div>
  </div>
  <div class="svg">
    <div class="svg1">
      Audit Ratio
      <svg width="250" height="250" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#22c55e; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4ade80; stop-opacity:1" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ef4444; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f87171; stop-opacity:1" />
          </linearGradient>
        </defs>

        <circle r="80" cx="100" cy="100" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="15"/>

        <circle
          r="80"
          cx="100"
          cy="100"
          fill="transparent"
          stroke="url(#greenGradient)"
          stroke-width="15"
          stroke-dasharray="${successLength} ${circumference}"
          stroke-dashoffset="0"
          transform="rotate(-90 100 100)"
        />

        <circle
          r="80"
          cx="100"
          cy="100"
          fill="transparent"
          stroke="url(#redGradient)"
          stroke-width="15"
          stroke-dasharray="${failedLength} ${circumference}"
          stroke-dashoffset="-${successLength}"
          transform="rotate(-90 100 100)"
        />
        <text x="100" y="90" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="bold">
    ${success}
  </text>
  <text x="100" y="100" text-anchor="middle" font-size="10" fill="#22c55e">
    Success
  </text>

  <text x="100" y="130" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="bold">
    ${failed}
  </text>
  <text x="100" y="140" text-anchor="middle" font-size="10" fill="#ef4444">
    Failed
  </text>
      </svg>
    </div>

    <div class="svg2">
      Skills
        ${skills.map(skill => `
          <div>
            ${skill.skillType}
            <svg width="300" height="40">
              <rect x="0" y="0" width="300" height="40" fill="rgba(255, 255, 255, 0.1)" rx="10" ry="10"/>
              <rect x="0" y="0" width="${skill.skillAmount * 3}" height="40" fill="green" rx="10" ry="10"/>
                  <text
    x="${skill.skillAmount * 3}" 
    y="20"
    text-anchor="end"
    alignment-baseline="middle"
    font-size="10"
    fill="white">
    ${skill.skillAmount}%
  </text>
            </svg>
          </div>
        `).join('')}
    </div>
  </div>
</div>
`;


    document.getElementById("btn").addEventListener("click", () => {
      logout()
    })

  } catch (error) {
    console.log(error);

  }

}



function logout(params) {
      localStorage.removeItem('jwt');
   
document.body.innerHTML = `
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
}