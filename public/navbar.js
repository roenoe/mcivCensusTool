const navbar = document.getElementById("navbar")

displaynavbar()
function displaynavbar() {
  navbar.innerHTML = `
    <a href="./">View order</a>
    <a href=input.html>Input census</a>
    <a href=admin.html>Admin</a>
    <a href=account.html>Manage account</a>
    <a href="/logout">Log out</a>
  `
}
