const welcome = document.getElementById("welcome")

fetchusername()
async function fetchusername() {
  try {
    let response = await fetch('/fetchusername')
    let data = await response.json()
    console.log("Data", data)

    displaywelcome(data.username)
  } catch (error) {
    console.log("Error:", error)
  }
}

function displaywelcome(username) {
  welcome.innerHTML = `<p>Welcome to MCIV Census Tool, ${username}</p>`
}
