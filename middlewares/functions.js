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
  
  // idValidation = async (code) => {
  //   const { rows } = await pool.query(`
  //     SELECT
  //       id
  //     FROM
  //       activities
  //     WHERE
  //       code = $1
  //   `, [code])
  
  //   return rows[0];
  // }
  
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
  
  // UPDATE users SET name='test2' WHERE id=120908182;
  
  editUserProfile = async (userData) => {
    const { rows } = await pool.query(
      `
        UPDATE users SET
            name = $1,
            email = $2,
            password = $3
        WHERE
          id = $4
        RETURNING * 
        `, [userData.name, userData.email, userData.hashPassword ,userData.id]);
    
        return rows[0]
  }

//   Pantemaskin

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
    createPantData
}