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