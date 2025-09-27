  export const loginUI = `

  <div id="content">
    <div class="login">
    <h1>Zone01</h1>
    <form  id="form">
    <input type="text"  placeholder="username/email" id="username">
    <input type="password"  placeholder="password" id="password">
    <span id="error"></span>
    <button type="submit">login</button>
    </form>
    </div>
    </div>
    `

export function header(user) {
 
  return `
    <header id="header">
  <div id="welcom">
    <h1>Welcome ${user.firstName} ${user.lastName}</h1>
  </div>
  <div id="btn"><button id="logout">logOut</button></div>
</header>
`


}

export function svg2(skills) {

  if (!skills) {
    return
  }
  return `
  <div class="svg2">
  <h3 style="text-align: center;">Skills</h3>
  <div class="skills-container">
    ${skills.map(skill => `
      <div class="skill-item">
        <div class="skill-name">
          <span>${skill.skillType.split("_").slice(1).toString()}</span>
          <span class="skill-percentage">${skill.skillAmount}%</span>
        </div>
        <div class="">
          <svg width="100%" height="10">
            <rect x="0" y="0" width="100%" height="10" fill="#e0e0e0" rx="5" ry="5"></rect>
            <rect x="0" y="0" 
                  width="${Math.min(skill.skillAmount, 100)}%" 
                  height="10" 
                  fill="#c084fc" 
                  rx="5" ry="5"></rect>
          </svg>
        </div>
      </div>
    `).join('')}
  </div>
</div>
`
}
export function svg1(successLength, circumference, failedLength, success, failed, auditRatio) {
 
  return `
      <div class="svg1">
      <h3>Audit Ratio</h3>
      <svg width="250" height="250">
       
        <circle r="80" cx="100" cy="100" fill="transparent" stroke="rgba(102, 126, 234, 0.1)" stroke-width="15"/>
       <circle
  r="80"
  cx="100"
  cy="100"
  fill="transparent"
  stroke="#22c55e"
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
  stroke="#ef4444"
  stroke-width="15"
  stroke-dasharray="${failedLength} ${circumference}"
  stroke-dashoffset="-${successLength}"
  transform="rotate(-90 100 100)"
/>
        <text x="100" y="90" text-anchor="middle" font-size="12" fill="#22c55e" font-weight="bold">
          ${success}
        </text>
        <text x="100" y="105" text-anchor="middle" font-size="10" fill="#22c55e">
          Success
        </text>
        <text x="100" y="125" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="bold">
          ${failed}
        </text>
        <text x="100" y="140" text-anchor="middle" font-size="10" fill="#ef4444">
          Failed
        </text>
        <text x="100" y="160" text-anchor="middle" font-size="10" fill="#667eea" font-weight="bold">
          Ratio: ${auditRatio.toFixed(2)}
        </text>
      </svg>
    </div>
    `
}