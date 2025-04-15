let lastcensus = []

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
  calculatecensus()
  const lastcensus = document.getElementById("lastcensus")
}

function calculatecensus() {
  // SORT BY POP
  // SORT BY CIV NUMBER
  // SORT BY MILITARY
}
