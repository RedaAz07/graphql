import { quer } from "./query.js";
import { header, loginUI, svg1, svg2 } from "./ui.js";
const loginApi = "https://learn.zone01oujda.ma/api/auth/signin"
const dataApi = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql"






export async function login() {
  document.body.innerHTML = loginUI
  const form = document.getElementById("form")
  const spanError = document.getElementById("error")
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    error.innerHTML = ""
    if (username.vlaue === "" || password.value === "") {
      spanError.style.display = "block"
      spanError.innerHTML = "empty data"
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

      })
      if (!respons.ok) {
        throw new Error("invalid credentials");
      }
      const data = await respons.json();
      localStorage.setItem("token", data);
      Profile()
    } catch (error) {
      console.log(error);

      spanError.style.display = "block"

      spanError.innerHTML = error.message
    }
  })
}

export async function Profile() {
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
        query: quer
      })
    });
    if (!response.ok) {
      throw new Error('Unauthorized');
    }
    let data = await response.json();
    data = data.data

    if (!data) {
      logout()
      return
    }
    svg(data)
    document.getElementById("btn").addEventListener("click", () => {
      logout()
    })
  } catch (error) {
    console.log(error);
  }
}



function svg(data) {
  const projects = data.projects?.[0]?.finished_projects || [];

  const user = data.user?.[0] || {};
  const totalXp = data.totalXp?.aggregate?.sum?.amount || 0;
  const level = user.level?.[0]?.amount || 0;
  const success = data.audit?.[0]?.sucess?.aggregate?.count || 0;
  const failed = data.audit?.[0]?.failed?.aggregate?.count || 0;
  const totalAudits = success + failed;
  const auditRatio = data.audit?.[0]?.auditRatio || 0;
  const skills = data.skills?.[0]?.transactions || [];
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const successLength = (success / totalAudits) * circumference;
  const failedLength = (failed / totalAudits) * circumference;





  document.body.innerHTML = `
${header(user)}

   <div class="container">
        <div class="info">
            <div class="xp">
                <h3>Total XP</h3>
                <span>${(totalXp / 1000).toFixed(1)}KB</span>
            </div>
            <div class="level">
                <h3>Current Level</h3>
                <div class="level-cr">${level}</div>
            </div>
        </div>

        <div class="svg">
            <div class="projects-section">
                <h3>Recent Projects</h3>
                <div class="table-container">
                    <div class="table-scroll">
                        <table class="projects-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Date</th>
                                    <th>Team Members</th>
                                </tr>
                            </thead>

                            <tbody id="projects-tbody">

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ${svg2(skills)}
            ${svg1(successLength, circumference, failedLength, success, failed, auditRatio)}

        </div>
    </div>

`;
  const tbody = document.getElementById('projects-tbody');
  tbody.innerHTML = '';

  let rowIndex = 0;


  if (!projects) {
    return
  }
  projects.forEach(transaction => {
    const row = document.createElement('tr');
    row.style.setProperty('--row-index', rowIndex);

    const group = transaction.group;
    const projectName = transaction.group.path.replace("/oujda/module/", "")
    const date = new Date(transaction.group.updatedAt);

    // Format date
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });



    let memberTags = '';
    if (group && group.members) {
      memberTags = group.members.map(member =>
        `<a  href="https://profile.zone01oujda.ma/profile/${member.userLogin}"  target="_blank" rel="noopener noreferrer"><span class="member-tag">${member.userLogin}</span></a>`
      ).join('');
    }

    row.innerHTML = `
                        <td>
                            <div class="project-name">${projectName}</div>
                        </td>
                     
                        <td class="project-date">
                            ${formattedDate}
                        </td>
                        <td>
                            <div class="group-members">
                                ${memberTags}
                            </div>
                        </td>
                    `;

    tbody.appendChild(row);
    rowIndex++;

  });
}




function logout() {
  localStorage.removeItem('token');
  login()
}