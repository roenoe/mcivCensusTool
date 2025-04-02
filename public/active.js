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
  if (check()) {
    senddata()
  }
  console.log(topush)
  alert("fasdfas")
}

function check() {
  var alert = false
  var validnumalert = false
  for (var i = 0; i < topush.length; i++) {
    if (Number.isNaN(topush[i].number)) {
      alert = true
    } //else if (topush[i].number < 0 > 55
    if (alert) {
      alert("Please fill in all the fields, and only use numbers")
      return false
    }
  }
  return true
}

function senddata() {
  // Send census info
  // send turn number
  // increment turn
  //location.reload()
}
