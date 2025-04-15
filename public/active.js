let actives = []


async function fetchuser() {
  try {
    let response = await fetch('/fetchuser')
    let data = await response.json()

    user = data

  } catch (error) {
    console.log("Error:", error)
  }
}

fetchactive()
async function fetchactive() {
  try {
    let response = await fetch('/fetchactive')
    let data = await response.json()
    actives = data

    if (data) {
      displayactive()
    }

  } catch (error) {
    console.log("Error:", error)
  }
}

function displayactive() {
  const activeselection = document.getElementById("activeselection")

  activeselection.innerHTML = `
    <h2>What is your census number?</h2>

    <table id="activeselectiontable">
      <tr>
        <th>Civilization</th>
        <th>Census</th>
        <th>Military</th>
      </tr>
    </table>

    <button onclick="calculatecensus()">Calculate</button>
  `

  displayactiveselectionelements()
}

function displayactiveselectionelements() {
  const activeselectiontable = document.getElementById("activeselectiontable")

  actives.forEach(active => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>
        ${active.civid} ${active.name}
      </td>
      <td>
        <input type="number" id="${active.name}-field" name="population">
      </td>
      <td>
        button
      </td>
    `

    activeselectiontable.appendChild(row)
  })
}

let topush = []
async function calculatecensus() {
  topush = []
  await fetchuser()

  for (var i = 0; i < actives.length; i++) {
    const field = document.getElementById(`${actives[i].name}-field`)
    const number = parseInt(field.value)

    topush.push({
      activeid: actives[i].id,
      number: number
    })
  }
  if (await check()) {
    await sendcensuses()
  }
  console.log(topush)
}

async function check() {
  for (var i = 0; i < topush.length; i++) {
    // Check if number at all
    if (Number.isNaN(topush[i].number)) {
      alert("Please fill in all the fields, and only use numbers")
      return false
    }
    // Check valid number
    if (topush[i].number < 0 || topush[i].number > 55) {
      alert("Please use a valid number. Valid numbers are between 1-55 (inclusive)")
      return false
    }
  }
  return true
}

async function sendcensuses() {
  for (var i = 0; i < topush.length; i++) {
    await sendcensus(topush[i])
  }
  await incrementturn()
  location.reload()
}

async function sendcensus(data) {
  try {
    await fetch('/activatecensus', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        activeid: data.activeid,
        number: data.number
      })
    })
  } catch (error) {
    console.log("Error", error)
  }
}

async function incrementturn() {
  try {
    await fetch('/incrementturn', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    })
  } catch (error) {
    console.log("Erorr", error)
  }
}
