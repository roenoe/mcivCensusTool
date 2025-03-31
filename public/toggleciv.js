let togglecivs = []
let civs = []

fetchactive()
async function fetchactive() {
  try {
    let response = await fetch('/fetchactive')
    let data = await response.json()

    if (!data) {
      fetchcivs()
    }

  } catch (error) {
    console.log("Error:", error)
  }
}

async function fetchcivs() {
  try {
    let response = await fetch('/fetchcivs')
    let data = await response.json()
    civs = data

    displaycivselection()
  } catch (error) {
    console.log("Error", error)
  }
}

function displaycivselection() {
  const civselection = document.getElementById('civselection')
  civselection.innerHTML = `
    <h2>Select Civilizations for your game</h2>

    <table id="civselectiontable">
      <tr>
        <th>Civilization</th>
        <th>Button <button onclick="toggleall()">Toggle all</button></th>
      </tr>
    </table>

    <button onclick="activatecivs()">Submit these civs as your active civs</button>
    ` // Empty the table

  displaycivselectionelements()
}
function displaycivselectionelements() {

  civs.forEach(civ => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${civ.id} ${civ.name}</td>
      <td>
        <button id="${civ.name}-btn" onclick="toggleciv('${civ.name}-btn', ${civ.id})">Toggle civ</button>
      </td>
    `

    civselectiontable.appendChild(row)
  })
}

function toggleall() {

  civs.forEach(civ => {
    const btn = civ.name + "-btn"
    toggleciv(btn, civ.id)
  })
}

function toggleciv(btnid, civid) {
  let btn = document.getElementById(btnid)
  btn.classList.toggle("green")
  let exists = false
  let location = ""
  for (var i = 0; i < togglecivs.length; i++) {
    if (togglecivs[i] == civid) {
      exists = true
      location = i
    }
  }
  if (exists) {
    togglecivs.splice(location, 1)
  } else {
    togglecivs.push(civid)
  }
}

async function activatecivs() {
  for (var i = 0; i <= togglecivs.length; i++) {
    await activateciv(togglecivs[i])
  }
  location.reload()
}


async function activateciv(civid) {
  try {
    await fetch('/activateciv', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ civid: civid })
    })
  } catch (error) {
    console.log("Error", error)
  }
}

