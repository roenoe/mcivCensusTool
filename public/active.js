let check = false

fetchactive()
async function fetchactive() {
  try {
    let response = await fetch('/fetchactive')
    let data = await response.json()

    console.log(data)
    if (data) {
      check = true
    }

  } catch (error) {
    console.log("Error:", error)
  }
}


