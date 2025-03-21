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

