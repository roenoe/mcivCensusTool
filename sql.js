import sqlite3 from 'better-sqlite3'
//import { query } from 'express'
import pkg from 'express'
const { query } = pkg
const db = sqlite3('./db/database.db')


export function getid(username) {
  const sqltext = 'select id from user where name = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(username)
  if (response.length == 0) {
    return false
  }
  return response[0].id
}

export function getuser(userid) {
  const sqltext = 'select id, name, password, turn, admin from user where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  if (response.length == 0) {
    return false
  }
  return response[0]
}

export function getusers() {
  const sqltext = 'select id, name, turn, admin, cookies from user'
  const sql = db.prepare(sqltext)
  const response = sql.all()
  if (response.length == 0) {
    return false
  }
  return response
}

export function genuser(username, password, cookies) {
  if (getid(username)) {
    return false
  }

  const sqltext = 'insert into user (name, turn, password, admin, cookies) values (?, ?, ?, ?, ?)'
  const sql = db.prepare(sqltext)
  const response = sql.run(username, 0, password, 0, cookies)
  return response
}

export function updatepassword(userid, newpassword) {
  const sqltext = 'update user set password = ? where user.id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.run(newpassword, userid)
  return response
}

export function getcivs() {
  const sqltext = 'select id, name from civ'
  const sql = db.prepare(sqltext)
  const response = sql.all()
  return response
}

export function getactive(userid) {
  const sqltext = ' select active.id, civid, military, name from active ' +
    ' inner join civ on active.civid = civ.id ' +
    ' where userid = ? ' +
    ' order by civid '
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  if (response.length == 0) {
    return false
  }
  return response
}

export function getlastcensus(userid, turn) {
  const sqltext = 'select civid, name, number, military from census ' +
    ' inner join active on activeid = active.id ' +
    ' inner join civ on active.civid = civ.id ' +
    ' where userid = ? ' +
    ' and turn = ? '
  const sql = db.prepare(sqltext)
  const response = sql.all(userid, turn)
  if (response.length == 0) {
    return false
  }
  return response
}

export function activateciv(civid, userid) {
  const sqltext = 'insert into active (civid, userid, military) values (?, ?, ?)'
  const sql = db.prepare(sqltext)
  const response = sql.run(civid, userid, 0)
  return response
}

export function activatecensus(activeid, turn, number) {
  const sqltext = 'insert into census (activeid, number, turn) values (?, ?, ?)'
  const sql = db.prepare(sqltext)
  const response = sql.run(activeid, number, turn)
  return response
}

export function incrementturn(userid, turn) {
  const sqltext = 'update user set turn = ? where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.run(turn + 1, userid)
  return response
}

export function togglemilitary(activeid) {
  const sqltext = 'update active set military = ? where id = ?'
  const sql = db.prepare(sqltext)
  let response = ""
  if (checkmilitarystatus(activeid)) {
    response = sql.run(0, activeid)
  } else {
    response = sql.run(1, activeid)
  }
  return response
}

function checkmilitarystatus(activeid) {
  const sqltext = 'select military from active where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(activeid)
  return response[0].military
}

export function toggleadmin(userid) {
  const sqltext = 'update user set admin = ? where id = ?'
  const sql = db.prepare(sqltext)
  let response = ""
  if (checkadminstatus(userid)) {
    response = sql.run(0, userid)
  } else {
    response = sql.run(1, userid)
  }
  return response
}

function checkadminstatus(userid) {
  const sqltext = 'select admin from user where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  return response[0].admin
}

export function togglecookies(userid) {
  const sqltext = 'update user set cookies = ? where id = ?'
  const sql = db.prepare(sqltext)
  let response = ""
  if (checkcookiestatus(userid)) {
    response = sql.run(0, userid)
  } else {
    response = sql.run(1, userid)
  }
  return response
}

export function checkcookiestatus(userid) {
  const sqltext = 'select cookies from user where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  return response[0].cookies
}

export function resetprogress(userid) { // MAKE SURE IT SETS YOUR TURN COUNTER TO 0
  const sqlquery0 = ' DELETE FROM census ' +
    ' WHERE census.activeid IN ( ' +
    '     SELECT active.id ' +
    '     FROM active ' +
    '     JOIN user ON active.userid = user.id ' +
    '     WHERE user.id = ? ' +
    ' ); '
  const sqlquery1 = '  ' +
    ' DELETE FROM active ' +
    ' WHERE active.userid IN( ' +
    '       SELECT id ' +
    '     FROM user ' +
    '     WHERE user.id = ? ' +
    ' ); '
  const sqlquery2 = 'update user set turn = 0 where user.id = ?'
  var response = []
  const sqltext = [sqlquery0, sqlquery1, sqlquery2]

  for (var i = 0; i < sqltext.length; i++) {
    const sql = db.prepare(sqltext[i])
    response.push(sql.run(userid))
  }
  return response

}

export function deluser(userid) {
  resetprogress(userid)
  const sqltext = 'delete from user where user.id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.run(userid)
  return response
}
