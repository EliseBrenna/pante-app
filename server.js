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
// async function createUser(name, email, password) {
//     const { rows } = await pool.query(`
//         INSERT INTO users(
//           name,
//           email,
//           password
//         )
//         VALUES(
//           $1,
//           $2,
//           $3
//         )
//       RETURNING *
//       `, [name, email, password]);

//     return rows[0]
// }

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

// api.get(`/signup`, async (req, res) => {
//     const { name, email, password } = req.body;
//     const newUser = await createUser(name, email, password);
//     res.send(newUser);
// })

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
          sum,
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
      session.sum,
      session.id
    ]

    
  
    return pool.query(queryText, queryValues)
      .then(({
        rows
      }) => {
        return rows.map((elem) => {
          return {
            code: elem.code,
            sum: elem.sum,
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
      sum,
      id,
    } = req.body;
  
    try {
      const newSession = await createPantData({
        code,
        sum,
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
      
      AND 
      UPDATE users
      SET sum=$1
      
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
            sum: elem.sum,
            id: elem.id,
          };
        });
      })
      .then((session) => session[0]);
  }

  getActivities = async (id) => {
    const { rows } = pool.query(`
    SELECT * FROM activity
    WHERE activity.id = ${id}
    `)

    return rows.map()
  }

  api.get('/activity:id', async (req, res) => {
    const { id } = req.params;
    const all = await getActivities(id);
    res.send(all)
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