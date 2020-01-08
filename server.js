require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const bcrypt = require('bcryptjs');
const app = express();
const api = express();
const { authenticate } = require('./middleware')



const secret = process.env.SECRET;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


// 

//Defining middlewares: 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('build'));

//Functions:

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
createUser = async (name, email, phone, password) => {
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

phoneValidation = async (phone) => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(phone)
    FROM
      users
    WHERE
      phone = $1
  `, [phone])

  return rows[0]
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

getSaldoById = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
      id, 
      SUM(amount)
    FROM
      activity
    WHERE
      id = $1
    GROUP BY 
      id
  `, [id])
  
  return rows
}


//   Creating activity

//Routes:
// api.get(`/users`, async (req, res) => {
//     const users = await getUsers();
//     res.send(users)
// })

//Developers routes

api.get(`/users`, async (req, res) => {
  const users = await getUsers();
  res.send(users)
})

api.get(`/user`, authenticate, async (req, res) => {
  const { id } = req.user;
  const user = await getUserById(id);
  res.send(user)
})

api.get('/activity', async (req, res) => {
  const all = await getActivities();
  res.send(all)
})

api.get('/saldo', authenticate, async (req, res) => {
  const { id } = req.user;
  const saldo = await getSaldoById(id);
  console.log(saldo)
  res.send(saldo)
})

api.put('/home', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { userCode } = req.body;

  const result = await updatePantData({
    userCode,
    userId,
    });
    res.send(result)
});

//Client routes

api.get(`/session`, authenticate,  (req, res) => {
  console.log(req.user.id)
  res.send({
      message: 'You are authenticated'
  });
  
})

api.post('/session', async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await getUserByEmail(email)

    if(!user) {
      return res.status(401).json({status: 401, message: 'Unknown email' })
    }

    if(!match) {
      return res.status(401).json({ status: 401, message: 'Wrong password' })
    }

    const match = bcrypt.compareSync(password, user.password);

    const token = jwt.sign({ 
      id: user.id,
      name: user.name
    }, new Buffer(secret, 'base64'));

      res.send({
        token: token
      })

    console.log(token)

    
  } catch(error) {
    return res.status(401).json({status: 401, message: 'Oops something went wrong'})
  }
});



api.post(`/signup`, async (req, res) => {
  const { name, email, phone, password } = req.body;
  // securing passwords
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const validateEmail = await emailValidation(email);
  const validatePhone = await phoneValidation(phone);

  if(+validateEmail.count && +validatePhone.count){
    return res.status(403).json({ status: 403, message: 'Email and phonenumber is already in use'})
  }else if(+validateEmail.count) {
    return res.status(403).json({ status: 403, message: 'Email is already in use'})
  } else if (+validatePhone.count) {
    return res.status(403).json({ status: 403, message: 'Phonenumber is already in use'})
  } else {
    const newUser = await createUser(name, email, phone, hashPassword);
    res.send(newUser);
  } 
})

// PANTEMASKIN

//Functions

createPantData = async (session) => {
  const { rows } = await pool.query(
  `
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
    `, [session.code, session.amount, session.id]);

    return rows[0]
}

updatePantData = async (session) => {
  const { rows } = await pool.query(
    `
    UPDATE activity 
    SET id=$1 WHERE code=$2
    RETURNING *
    `, [session.userId, session.userCode]
  ) 

  return rows[0]
}

  //Routes
  
api.post('/pant', async (req, res) => {
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




api.put('/pant', async (req, res) => {
  const {
    userCode,
    userId,
  } = req.body;
  console.log(userId, userCode)

  const result = await updatePantData({
    userCode,
    userId,
    });
    res.send(result)
}); 


app.use('/api', api)

//Listens to port:
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Pante-app is running at port: http://localhost:${port}`)
})