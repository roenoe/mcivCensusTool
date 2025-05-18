const welcome = document.getElementById("welcome")
let user = []

fetchuser()
async function fetchuser() {
  try {
    let response = await fetch('/fetchuser')
    let data = await response.json()

    user = data

    displaywelcome(data.username, data.userturn, data.usercookies)
  } catch (error) {
    console.log("Error:", error)
  }
}

function displaywelcome(username, userturn, usercookies) {
  let cookietext = ""
  if (usercookies) {
    cookietext = "Cookies are currently enabled for your account."
  } else {
    cookietext = "Cookies are currently disabled for your account."
  }
  welcome.innerHTML = `
    <p>Welcome to MCIV Census Tool, ${username}.</p>
    <p>You are on turn ${userturn}.</p>
    <p>${cookietext}</p>
  `
}

