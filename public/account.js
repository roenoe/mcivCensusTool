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
    <p>Please read our <a href=tos.html>Terms of Service</a>.</p>
    <p>You are on turn ${userturn}.</p>
    <p>${cookietext}</p>
  `
}

async function resetprogress() {
  let text = `Are you sure you want to reset your game data? This action is irreversible.`;
  if (confirm(text) == false) {
    return false
  }

  try {
    await fetch('/resetprogress', {
      method: 'POST',
    })
  } catch (error) {
    console.log("Error", error)
  }
  fetchuser()
}

async function deluser() {
  let text = "Are you sure you want do delete your account? This action is irreversible."
  if (confirm(text) == false) {
    return false
  }

  try {
    await fetch('/deluser', {
      method: 'POST',
    })
  } catch (error) {
    console.log("Error", error)
  }
  fetchuser()
}

async function togglecookies() {
  try {
    await fetch('/togglecookies', {
      method: 'POST',
    })
  } catch (error) {
    console.log("Error", error)
  }
  fetchuser()
}
