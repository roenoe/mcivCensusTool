let lastcensus = []

fetchlastcensus()
setInterval(function() {
  fetchlastcensus()
}, 3000);

async function fetchlastcensus() {
  try {
    let response = await fetch('/fetchlastcensus')
    let data = await response.json()
    lastcensus = data

    if (data) {
      displaylastcensus()
    }

  } catch (error) {
    console.log("Error", error)
  }

}

function displaylastcensus() {
  calculatelastcensus()
  const lastcensus = document.getElementById("lastcensus")

  lastcensus.innerHTML = `
    <h2>
      This is the order in which civs should move
    </h2>

    <table id="lastcensustable">
      <tr>
        <th>Civilization</th>
        <th>Census</th>
        <th>Military</th>
      </tr>
    </table>
  `

  displaylastcensuselements()
}

function calculatelastcensus() {
  // Sort by military (ascending)
  lastcensus.sort((a, b) => {
    if (a.military !== b.military) {
      return a.military - b.military;
    }
    // Then by number (descending)
    if (a.number !== b.number) {
      return b.number - a.number;
    }
    // Then by civid (ascending)
    return a.civid - b.civid;
  })
}

function displaylastcensuselements() {
  const lastcensustable = document.getElementById("lastcensustable")

  lastcensus.forEach(censusentry => {
    if (censusentry.military == 0) {
      censusentry.military = "No"
    } else {
      censusentry.military = "Yes"
    }
    const row = document.createElement('tr')
    row.className = censusentry.name
    row.innerHTML = `
      <td>
        ${censusentry.civid} ${censusentry.name}
      </td>
      <td>
        ${censusentry.number}
      </td>
      <td>
        ${censusentry.military}
      </td>
    `

    lastcensustable.appendChild(row)
  })
}
