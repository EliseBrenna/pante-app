require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const api = express();
app.use(express.static('build'));



const secret = process.env.SECRET;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//Defining middlewares: 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Functions:

async function getUsers(){
  const { rows } = await pool.query(`SELECT * FROM users ORDER BY users.id`);
  return rows.map(camelCase)
}

// Creating new users
async function createUser(name, email, phone, password) {
    const { rows } = await pool.query(`
        INSERT INTO users(
          name,
          email,
          phone,
          password
        )
        VALUES(
          $1,
          $2,
          $3,
          $4
        )
      RETURNING *
      `, [name, email, phone, password]);

    return rows[0]
}

//Get user profile
// async function getUserByName(email) {
//     const { rows } = await pool.query(`
//         SELECT * FROM 
//             users
//         WHERE
//             email = $1 
//     `, [email]);

//     return rows[0];
// }



//   Creating activity

//Routes:
// api.get(`/users`, async (req, res) => {
//     const users = await getUsers();
//     res.send(users)
// })

api.post(`/signup`, async (req, res) => {
    const { name, email, phone, password } = req.body;
    const newUser = await createUser(name, email, phone, password);
    res.send(newUser);
})

// api.get(`/user/:email`, async (req, res) => {
//     const { email } = req.params;
//     const profile = await getUserByName(email);
//     if(!profile) {
//         return res.status(404).send({ Error: `Unknown user with the email: ${email}` })
//     }
//     res.send(profile);
// })

// api.post(`/session`, async (req, res) => {
//     const { email, password } = req.body;
//     try {

//         const user = await getUserByName(email)
//         if(!user) {
//             return res.status(401).send({ error: 'Unknown user' })
//         }

//         if(!password)
//     } catch 
// })

api.get(`/users`, async (req, res) => {
  const users = await getUsers();
  res.send(users)
})

// PANTEMASKIN

function createPantData(session) {
    const queryText = `
      INSERT INTO activity(
          code,
          amount,
          id
      )
  
      VALUES(
          $1,
          $2,
          $3
      )
  
      RETURNING * 
      `
  
    const queryValues = [
      session.code,
      session.amount,
      session.id
    ]

    
  
    return pool.query(queryText, queryValues)
      .then(({
        rows
      }) => {
        return rows.map((elem) => {
          return {
            code: elem.code,
            amount: elem.amount,
            id: elem.id
          };
        });
      })
      .then((session) => session[0]);
  }
  
  api.post('/pant', async function (req, res) {
    console.log('got request')

    const {
      code,
      amount,
      id,
    } = req.body;
  
    try {
      const newSession = await createPantData({
        code,
        amount,
        id,
      })
  
      res.send(newSession);
    } catch (err) {
      console.log(err);
    }
  });
  
  
  
  function updatePantData(session) {
    const queryText = `
      UPDATE activity 
      SET id=$1 WHERE code=$2
      RETURNING *

      `
  
    const queryValues = [
      session.userId,
      session.userCode,
    ]
  
    return pool.query(queryText, queryValues)
      .then(({
        rows
      }) => {
        return rows.map((elem) => {
          return {
            code: elem.code,
            amount: elem.amount,
            id: elem.id,
          };
        });
      })
      .then((session) => session[0]);
  }

  getActivities = async () => {
    const { rows } = await pool.query(`
    SELECT 
      *
    FROM
      activity
    `)

    return rows
  }

  getSaldoById = async () => {
    const { rows } = await pool.query(`
    SELECT 
      id, 
      SUM(amount)
    FROM
      activity
    GROUP BY id;
    `)
    
    return rows
  }

  api.get('/activity', async (req, res) => {
    const all = await getActivities();
    res.send(all)
  })

  api.get('/saldo', async (req, res) => {
    const { id } = req.params;
    const saldo = await getSaldoById();
    res.send(saldo)
  })
  
  api.put('/pant', async function (req, res) {
    const {
      userCode,
      userId,
    } = req.body;
  
    updatePantData({
      userCode,
      userId,
      })
      .then((newSession) => {
        res.send(newSession);
      });
  });

//   SLUTT PANTEMASKIN
app.use('/api', api)

//Listens to port:
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Pante-app is running at port: http://localhost:${port}`)
})