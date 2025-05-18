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
