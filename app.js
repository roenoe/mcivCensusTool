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
  console.log("Checking path:", pathstocheck[i])
  app.get(pathstocheck[i], checkloggedin, (req, res) => {
    const filename = path.basename(pathstocheck[i])
    return res.sendFile(path.join(staticPath, filename))
  })
}
app.get('/account.html', checkloggedin, (req, res) => {
  return res.sendFile(path.join(staticPath, 'account.html'))
})
app.get('/input.html', checkloggedin, (req, res) => {
  return res.sendFile(path.join(staticPath, 'input.html'))
})


// Make sure the user is admin
const pathstocheckadmin = [
  '/admin.html',
]
for (var i = 0; i < pathstocheckadmin.length; i++) {
  console.log("Checking path:", pathstocheckadmin[i])
  app.get(pathstocheckadmin[i], checkloggedin, checkadmin, (req, res) => {
    return res.sendFile(path.join(staticPath, 'admin.html'))
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

  // Save login info in session
  if (match) {
    console.log("Logged in")
    req.session.loggedin = true
    req.session.username = user.name
    req.session.userid = user.id
    req.session.userturn = user.turn
    req.session.admin = user.admin
    req.session.usercookies = user.cookies
  } else {
    return res.status(401).send('Invalid username or password')
  }

  // Redirect user to home page
  return res.redirect('/')
})

// Admin redirection
app.get('/admin', (req, res) => {
  res.redirect('/admin.html')
})

// Signup function
app.post('/signup', async (req, res) => {
  const { username, password, cookies } = req.body

  const hash = encryptpassword(password)

  // Check if user already exists
  if (sql.getid(username)) {
    res.status(409).send('Username already taken')
  }

  // Generate user in sql
  if (!sql.genuser(username, hash, cookies)) {
    return res.errored
  }

  // Redirect user to login page
  return res.redirect('/login.html')
})

// Encryption algorithm
function encryptpassword(password) {
  const saltrounds = 10
  const salt = bcrypt.genSaltSync(saltrounds)
  const hash = bcrypt.hashSync(password, salt)

  return hash
}

// Function for checking whether user is logged in
function checkloggedin(req, res, next) {
  console.log("checkloggedin")
  console.log("Session:", req.session)
  if (req.session.loggedin) {
    console.log('Logged in')
    return next()
  } else {
    console.log('Not logged in')
    return res.redirect('/login.html')
  }
}

// Function for checking whether user is admin
function checkadmin(req, res, next) {
  console.log("checkadmin")
  console.log("Session:", req.session)
  if (req.session.admin) {
    console.log('Admin')
    return next()
  } else {
    console.log('Not admin')
    return res.status(403).send('You need to be an administrator to see this page')
  }
}

// Reset password function
app.post('/resetpassword', checkloggedin, checkadmin, (req, res) => {
  const { userid, newpassword } = req.body
  const hash = encryptpassword(newpassword)
  if (!sql.updatepassword(userid, hash)) {
    return res.errored
  }
  return res.json({ message: 'Changed password', userid: userid })
})

// Reset progress function
app.post('/resetprogress', checkloggedin, (req, res) => {
  req.session.userturn = 0

  let userid = req.session.userid
  if ((req.session.admin) && (typeof req.body.userid !== 'undefined')) {
    userid = req.body.userid
  }

  sql.resetprogress(userid)
  return res.json({ message: 'Progress reset', userturn: 0 });
})

app.post('/deluser', checkloggedin, (req, res) => {
  let userid = req.session.userid
  if (req.session.admin) {
    if (typeof req.body.userid !== 'undefined') {
      userid = req.body.userid
    }
  }
  sql.deluser(userid)
  if (req.session.userid == userid) {
    res.redirect('/logout')
  } else {
    return res.json({ message: 'User deleted', userid: userid });
  }
})

// Toggle admin function
app.post('/toggleadmin', checkloggedin, checkadmin, (req, res) => {
  const { userid } = req.body
  const toggled = sql.toggleadmin(userid)
  console.log(toggled)

  if (!toggled) {
    return res.json({ error: 'Failed to toggle admin' })
  } else {
    return res.json({ message: 'Toggled admin', userid: userid })
  }

})

// Toggle cookies function
app.post('/togglecookies', checkloggedin, (req, res) => {
  const userid = req.session.userid
  const toggled = sql.togglecookies(userid)
  console.log(toggled)

  req.session.usercookies = sql.checkcookiestatus(userid)

  if (!toggled) {
    return res.json({ error: 'Failed to toggle cookies' })
  } else {
    return res.json({ message: 'Toggled cookies', userid: userid })
  }

})

// User fetch function
app.get('/fetchuser', checkloggedin, (req, res) => {
  let username = {
    username: req.session.username,
    userturn: req.session.userturn,
    usercookies: req.session.usercookies
  }
  res.send(username)
})

// Users fetch function (for fetching all of them for admins)
app.get('/fetchusers', checkloggedin, checkadmin, (req, res) => {
  let users = sql.getusers()
  if (!users) {
    return res.errored
  }
  res.send(users)
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
