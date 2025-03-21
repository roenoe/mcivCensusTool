let togglecivs = []

fetchuser()
async function fetchuser() {
  try {
    let response = await fetch('/fetchuser')
    let data = await response.json()

    if (data.userturn == 1) { // CHECK FOR WHETHER USER HAS CHOSEN CIVS YET IN A BETTER WAY
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
      <td>${civ.number} ${civ.name}</td>
      <td>
        <button id="${civ.name}-btn" onclick="toggleciv('${civ.name}-btn', ${civ.id})">Toggle civ</button>
      </td>
    `
    civselectiontable.appendChild(row)

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

function activatecivs() {
  for (var i = 0; togglecivs.length; i++) {
    activateciv(togglecivs[i])
  }
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

