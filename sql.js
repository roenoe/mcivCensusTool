import bcrypt from 'bcrypt'
import sqlite3 from 'better-sqlite3'
const db = sqlite3('./db/mciv.db')


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
  const sqltext = 'select id, name, password, turn from user where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  if (response.length == 0) {
    return false
  }
  return response[0]
}
