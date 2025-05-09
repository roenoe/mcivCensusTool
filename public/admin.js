let users = []

fetchusers()
async function fetchusers() {
  try {
    let response = await fetch('/fetchusers') //THIS DOES NOT EXIST
    let data = await response.json()
    users = data

    if (data) {
      displayusers()
    }

  } catch (error) {
    console.log("Error", error)
  }

}

function displayusers() {
  const userdiv = document.getElementById("userdiv")

  userdiv.innerHTML = `
    <h2>
      Table of users
    </h2>

    <table id="usertable">
      <th>ID</th>
      <th>Name</th>
      <th>Turn</th>
      <th>Admin</th>
      <th>Reset password</th>
    </table>
  `

  displayuserselements()
}

function displayuserselements() {
  const usertable = document.getElementById("usertable")
  users.forEach(user => {
    if (user.admin == 0) {
      user.admin = "No"
    } else {
      user.admin = "Yes
    }
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>
        ${user.id}
      </td>
      <td>
        ${user.turn}
      </td>
      <td>
        ${user.admin}
      </td>
      <td>
        <input type="password" id="${user.id}-field" name="Reset password" placeholder="Reset password">
        <button onclick='resetpassword("${user.id}")'>Reset password</button>
      </td>

    `
    usertable.appendChild(row)
  })
}

function resetpassword(userid) {
  let field = document.getElementById() //NOT FINISHED
}


async function togglemilitary(btnid, activeid) {
  let btn = document.getElementById(btnid)
  btn.classList.toggle("green")

  try {
    await fetch('/togglemilitary', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ activeid: activeid })
    })
  } catch (error) {
    console.log("Error", error)
  }
}
