import bcrypt from 'bcrypt'
import sqlite3 from 'better-sqlite3'
import { query } from 'express'
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
  const sqltext = 'select id, name, password, turn from user where id = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  if (response.length == 0) {
    return false
  }
  return response[0]
}

export function getcivs() {
  const sqltext = 'select id, name from civ'
  const sql = db.prepare(sqltext)
  const response = sql.all()
  return response
}

export function getactive(userid) {
  const sqltext = 'select id, civid, military from active where userid = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
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
