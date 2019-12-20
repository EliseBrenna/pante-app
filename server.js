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
function createUser(users) {
    const queryText = `
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
      `
  
    const queryValues = [
      users.name,
      users.handle,
      users.password,
    ]
  
    return pool.query(queryText, queryValues)
      .then(({
        rows
      }) => {
        return rows.map((elem) => {
          return {
            id: elem.id,
            name: elem.name,
            handle: elem.handle,
            password: elem.password,
          };
        });
      })
      .then((users) => users[0]);
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
    res.send(newUser)
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Pante-app is running at port: ${port}`)
})