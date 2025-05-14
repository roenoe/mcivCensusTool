let users = []

fetchusers()
async function fetchusers() {
  try {
    let response = await fetch('/fetchusers')
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
      <th>Cookies</th>
      <th>Reset password</th>
      <th>Manage user</th>
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
      user.admin = "Yes"
    }
    if (user.cookies == 0) {
      user.cookies = "No"
    } else {
      user.cookies = "Yes"
    }

    const row = document.createElement('tr')

    row.innerHTML = `
      <td>
        ${user.id}
      </td>
      <td>
        ${user.name}
      </td>
      <td>
        ${user.turn}
      </td>
      <td>
        ${user.admin}
        <button onclick='toggleadmin(${user.id})' class="right">Toggle admin</button>
      </td>
      <td>
        ${user.cookies}
      </td>
      <td>
        <input type="password" id="${user.id}-field" name="Reset password" placeholder="Reset password">
        <button onclick='resetpassword("${user.id}", "${user.name}")' class="right">Reset password</button>
      </td>
      <td>
        <button onclick='deluser(${user.id}, "${user.name}")' class="red">Delete user</button>
        <button onclick='resetprogress(${user.id}, "${user.name}")' class="red">Reset progress</button>
      </td>

    `
    usertable.appendChild(row)
  })
}

async function toggleadmin(userid) {
  try {
    await fetch('/toggleadmin', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userid: userid })
    })
  } catch (error) {
    console.log("Error", error)
  }
  await fetchusers()
}

async function deluser(userid, username) {
  let text = `Are you sure you want to delete ${username}? This action us permanent.`;
  if (confirm(text) == false) {
    return false
  }

  try {
    await fetch('/deluser', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userid: userid })
    })
  } catch (error) {
    console.log("Error", error)
  }
  await fetchusers()
}

async function resetprogress(userid, username) {
  let text = `Are you sure you want to reset ${username}'s data? This action is permanent.`;
  if (confirm(text) == false) {
    return false
  }

  try {
    await fetch('/resetprogress', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userid: userid })
    })
  } catch (error) {
    console.log("Error", error)
  }
  await fetchusers()
}

async function resetpassword(userid, username) {
  let text = `Are you sure you want to reset ${username}'s password?`;
  if (confirm(text) == false) {
    return false
  }

  const fieldid = userid + "-field"
  const field = document.getElementById(fieldid)
  const newpassword = field.value

  try {
    await fetch('/resetpassword', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        userid: userid,
        newpassword: newpassword
      })
    })
  } catch (error) {
    console.log("Error", error)
  }
}
