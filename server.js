require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const {
  Pool
} = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const api = express();
app.use(express.static('build'));


const port = process.env.PORT;
const secret = process.env.SECRET;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));