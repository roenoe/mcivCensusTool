const welcome = document.getElementById("welcome")
let user = []

fetchuser()
async function fetchuser() {
  try {
    let response = await fetch('/fetchuser')
    let data = await response.json()

    user = data

    displaywelcome(data.username, data.userturn)
  } catch (error) {
    console.log("Error:", error)
  }
}

function displaywelcome(username, userturn) {
  welcome.innerHTML = `<p>Welcome to MCIV Census Tool, ${username}. You are on turn ${userturn}</p>`
}

fetchcivs()
async function fetchcivs() {
  try {
    let response = await fetch('/fetchcivs')
    let data = await response.json()

    displaycivselection(data)
  } catch (error) {
    console.log("Error", error)
  }
}

function displaycivselection(civs) {
  const civselectiontable = document.getElementById('civselectiontable')
  civselectiontable.innerHTML = '<tr><th>Civilization</th><th>Button</th></tr>' // Empty the table

  civs.forEach(civ => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${civ.name}</td>
    `
    civselectiontable.appendChild(row)

  })
}

//        <td><button onclick="promoteUser(${person.userid})" class="green">Promote</button></td>
