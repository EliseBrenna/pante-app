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
    connectionString: process.env.DATABASE_URL,
});

//Defining middlewares: 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Functions:

// Creating new users
async function createUser(name, email, password) {
    const { rows } = await pool.query(`
        INSERT INTO users(
          name,
          email,
          password
        )
        VALUES(
          $1,
          $2,
          $3
        )
      RETURNING *
      `, [name, email, password]);

    return rows[0]
}

//Get user profile
async function getUserByName(email) {
    const { rows } = await pool.query(`
        SELECT * FROM 
            users
        WHERE
            email = $1 
    `, [email]);

    return rows[0];
}



//   Creating activity

//Routes:
api.get(`/users`, async (req, res) => {
    const users = await getUsers();
    res.send(users)
})

api.get(`/signup`, async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await createUser(name, email, password);
    res.send(newUser);
})

api.get(`/user/:email`, async (req, res) => {
    const { email } = req.params;
    const profile = await getUserByName(email);
    if(!profile) {
        return res.status(404).send({ Error: `Unknown user with the email: ${email}` })
    }
    res.send(profile);
})

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


//Listens to port:
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Pante-app is running at port: http://localhost:${port}`)
})