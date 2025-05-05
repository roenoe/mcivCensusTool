import * as sql from './sql.js'

import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt'
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
  if (await bcrypt.compare(password, user.password)) {
    match = true
  } else {
    match = false
    console.log("Invalid password")
  }
  //if (password === user.password) {
  //  match = true
  //} else {
  //  match = false
  //  console.log("Invalid password")
  //}

  // Save login info in session
  if (match) {
    console.log("Logged in")
    req.session.loggedin = true
    req.session.username = user.name
    req.session.userid = user.id
    req.session.userturn = user.turn
  } else {
    return res.status(401).send('Invalid username or password')
  }

  // Redirect user to home page
  return res.redirect('/')
})

// Signup function
app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  const saltrounds = 10
  const salt = bcrypt.genSaltSync(saltrounds)
  const hash = bcrypt.hashSync(password, salt)

  // Check if user already exists
  if (sql.getid(username)) {
    res.status(409).send('Username already taken')
  }

  // Generate user in sql
  if (!sql.genuser(username, hash)) {
    return res.errored
  }

  // Redirect user to login page
  return res.redirect('/login.html')
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

// Census fetch function
app.get('/fetchlastcensus', checkloggedin, (req, res) => {
  const userid = req.session.userid
  const turn = req.session.userturn - 1
  const lastcensus = sql.getlastcensus(userid, turn)
  res.send(lastcensus)
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

// Active toggle military function
app.post('/togglemilitary', checkloggedin, (req, res) => {
  const { activeid } = req.body

  const toggled = sql.togglemilitary(activeid)
  console.log(toggled)

  if (!toggled) {
    return res.json({ error: 'Failed to toggle military' })
  } else {
    return res.json({ message: 'Toggled military', activeid: activeid })
  }
})

// Census activation function
app.post('/activatecensus', checkloggedin, (req, res) => {
  let turn = req.session.userturn
  let activeid = req.body.activeid
  let number = req.body.number

  const census = sql.activatecensus(activeid, turn, number)

  if (!census) {
    return res.json({ error: 'Failed to activate census' })
  } else {
    return res.json({ message: 'Activated census', activeid: activeid })
  }
})

// Turn increment function
app.post('/incrementturn', checkloggedin, (req, res) => {
  let userid = req.session.userid
  let userturn = req.session.userturn

  const increment = sql.incrementturn(userid, userturn)

  if (!increment) {
    return res.json({ error: 'Failed to increment turn' })
  } else {
    req.session.userturn += 1
    return res.json({ message: 'Incremented turn', userturn: userturn + 1 })
  }
})




app.use(express.static(staticPath))
const serverport = 21570
app.listen(serverport, () => console.log('Server running on http://127.0.0.1:' + serverport))
