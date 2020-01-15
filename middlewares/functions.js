const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


getUsers = async (id) => {
    const { rows } = await pool.query(`
      SELECT 
        * 
      FROM 
        users 
      ORDER BY 
        users.id`);
  
    return rows
  }
  
// Creating new users
createUser = async (name, email, password, id) => {
    const { rows } = await pool.query(`
      INSERT INTO users(
        name,
        email,
        password,
        id
      )
      VALUES(
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `, [name, email, password, id]);

    return rows[0]
}

// getting all user-data by email
getUserByEmail = async (email) => {
  const { rows } = await pool.query(`
    SELECT
      *
    FROM
      users
    WHERE
      email = $1`,
      [email])

  return rows[0]
}

// getting all user-data by id
getUserById = async (id) => {
  const { rows } = await pool.query(`
    SELECT
      *
    FROM
      users
    WHERE
      id = $1`,
      [id])

  return rows[0]
}

// Getting amount that is pantet
amountQuery = async (code) => {
  const { rows } = await pool.query(`
    SELECT
      amount
    FROM
      sessions
    WHERE
      code = $1
  `, [code])

  return rows[0];
}

// Checking that code exists in sessions
codeValidation = async (code) => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(code)
    FROM
      sessions
    WHERE
      code = $1
  `, [code])

  return rows[0];
}

// Checking if email exists in users
emailValidation = async (email) => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(email)
    FROM
      users
    WHERE
      email = $1
  `, [email])

  return rows[0];
}

// Getting all activities connected to a specific user
getActivitiesById = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
      *
    FROM
      activities
    WHERE
      user_id = $1
    ORDER BY 
      time DESC
  `, [id])

  return rows
}

// Getting total saldo by user id
getSaldoById = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
      *
    FROM
      activities
    WHERE
      user_id = $1
  `, [id])
  
  return rows
}

// Getting name by id
getNameById = async (id) => {
  const { rows } = await pool.query(`
  SELECT 
    name 
  FROM 
    users 
  WHERE id = $1
  `, [id])

  return rows[0]
}

// Used in transactions to insert into activities and remove from sessions
claimCode = async (code, id) => {

  const client = await pool.connect();

  try{
    await client.query('BEGIN');
    const pickCodeFromSessionsText = 'SELECT * FROM sessions WHERE code = $1'
    const res = await client.query(pickCodeFromSessionsText , [code]);

    const insertActivityText = 'INSERT INTO activities(amount, user_id) VALUES ($1, $2)'
    const insertActivityValues = [res.rows[0].amount, id]
    await client.query(insertActivityText, insertActivityValues);
    const deleteCodeFromSessionsText = 'DELETE FROM sessions WHERE code = $1'
    await client.query(deleteCodeFromSessionsText, [code]);
    await client.query('COMMIT');
  } catch(e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release();
  }
}

// Used to update userinfo in editprofile-route
editUserProfile = async (userData) => {
  const { rows } = await pool.query(
    `
    UPDATE users SET
        name = $1,
        email = $2
    WHERE
      id = $3
    RETURNING * 
    `, [userData.name, userData.email ,userData.id]);
  
  return rows[0]
}

// Used to update password on editprofile-route
editUserPassword = async (userData) => {
  const { rows } = await pool.query(
    `
    UPDATE users SET
        password = $1
    WHERE
      id = $2
    RETURNING * 
    `, [userData.hashPassword ,userData.id]);
  
  return rows[0]
}

// Withdraw from account
withdrawSaldo = async (amount, id) =>  {
  const { rows } = await pool.query(
    `
    INSERT INTO activities(
      amount,
      user_id
    )

    VALUES(
      $1,
      $2
    )

    RETURNING *
    `, [amount, id])

    return rows[0]
}

//Pantemaskin - creating input for sessions
createPantData = async (session) => {
  const { rows } = await pool.query(
  `
    INSERT INTO sessions(
        code,
        amount
    )

    VALUES(
        $1,
        $2
    )

    RETURNING * 
    `, [session.code, session.amount]);

    return rows[0]
}

deleteUser = async (id) => {
  const { rows } = await pool.query(
    `
    DELETE FROM 
      users
    WHERE 
      id = $1
    `, [id]
  );
  return rows[0]
}

module.exports = {
  getUsers,
  createUser,
  getUserByEmail,
  getUserById,
  amountQuery,
  codeValidation,
  emailValidation,
  getActivitiesById,
  getSaldoById,
  getNameById,
  claimCode,
  editUserProfile,
  editUserPassword,
  createPantData,
  deleteUser,
  withdrawSaldo,
}