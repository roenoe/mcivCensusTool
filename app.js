import * as sql from './sql.js'

import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, 'public')

// Middleware/session (req.session)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // This is just because of HTTP vs HTTPS
}))

// Make sure the user is logged in
const pathstocheck = [
  '/',
  '/index.html',
]
for (var i = 0; i < pathstocheck.length; i++) {
  app.get(pathstocheck[i], checkloggedin, (req, res) => {
    return res.sendFile(path.join(staticPath))
  })
}

// Login function
app.post('/login', async (req, res) => {
  // Define variables from form for comparison
  const { username, password } = req.body
  let match = false

  // Get user from database
  const userid = sql.getid(username)
  if (!userid) {
    return res.status(401).send('Invalid username or password')
  }
  const user = sql.getuser(userid)

  // Check if password matches
  if (password === user.password) {
    match = true
  } else {
    match = false
    console.log("Invalid password")
  }

  // Save login info in session
  if (match) {
    console.log("Logged in")
    req.session.loggedin = true
    req.session.username = user.name
    req.session.userid = user.id
    req.session.userturn = user.turn
  }

  // Redirect user to home page
  return res.redirect('/')
})


// Function for checking whether user is logged in
function checkloggedin(req, res, next) {
  if (req.session.loggedin) {
    console.log('Logged in')
    return next()
  } else {
    console.log('Not logged in')
    return res.redirect('/login.html')
  }
}

// User fetch function
app.get('/fetchuser', checkloggedin, (req, res) => {
  let username = {
    username: req.session.username,
    userturn: req.session.userturn
  }
  res.send(username)
})

// Civ list fetch funtion
app.get('/fetchcivs', checkloggedin, (req, res) => {
  const civs = sql.getcivs()
  res.send(civs)
})

// Active table for current user fetch function
app.get('/fetchactive', checkloggedin, (req, res) => {
  const active = sql.getactive(req.session.userid)
  res.send(active)
})

// Logout function
app.get('/logout', checkloggedin, (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


// Civ activation function
app.post('/activateciv', checkloggedin, (req, res) => {
  let userid = req.session.userid
  const { civid } = req.body

  const civ = sql.activateciv(civid, userid)

  if (!civ) {
    return res.json({ error: 'Failed to activate civ' })
  } else {
    return res.json({ message: 'Activated civ', civid: civid })
  }
})


app.use(express.static(staticPath))
const serverport = 21570
app.listen(serverport, () => console.log('Server running on http://127.0.0.1:' + serverport))
