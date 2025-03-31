let actives = []

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
        <input type="text" id="${active.name}-field" name="population">
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
  let empty = false

  for (var i = 0; i < actives.length; i++) {
    const field = document.getElementById(`${actives[i].name}-field`)
    if (field.value == "") { empty = true }
    const number = field.value

    topush.push({
      activeid: actives[i].id,
      number: number
      //, turn?
    })
  }
  //if (empty = true) { topush = [] }
  console.log(empty)
  console.log(topush)
  // for loop with number of items in active
  // send census numbers from fields
  // send turn number
  // increment turn
  //location.reload()
}
