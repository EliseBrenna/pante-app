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
          email = $2
      WHERE
        id = $3
      RETURNING * 
      `, [userData.name, userData.email, userData.id]);
  
      return rows[0]
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

api.get('/activity', authenticate, async (req, res) => {
  const { id } = req.user;
  const allActivities = await getActivitiesById(id);
  res.send(allActivities)
})

api.get('/saldo', authenticate, async (req, res) => {
  const { id } = req.user;
  const saldo = await getSaldoById(id);
  res.send(saldo)
})

api.post('/home', authenticate, async (req, res) => {
  const { id } = req.user;

  const {userCode} = req.body;
  console.log('code:', userCode);
  const checkCode = await codeValidation( userCode )
  console.log(checkCode.count)
  const amountInCode = await amountQuery ( userCode )

  if(checkCode.count === 0) {
    return res.status(403).json({ status: 403, message: 'Ingen kode funnet, vennligst tast inn korrekt kode'})
  } else {
    await claimCode(userCode, id);
    return res.status(200).json({ status: 200, message: `Din pant er registrert. Du har pantet for ${amountInCode.amount} kroner.`})
  }
})

// api.put('/home', authenticate, async (req, res) => {
//   const userId = req.user.id;
//   const { userCode } = req.body;

//   const checkId = await idValidation( userCode )
//   const checkCode = await codeValidation( userCode )
//   const getAmount = await amountQuery( userCode )

//   if (checkCode.count > 0) { // Sjekk om kode eksisterer
//     if (!checkId.id) { // kode eksisterer og ikke brukt av noen andre enda
//       await updatePantData({
//         userCode,
//         userId,
//         });
//         return res.status(200).json({ status: 200, message: `Din pant er registrert. Du pantet for ${getAmount.amount} kroner.`})
      
//     } else if (checkId === userId) { // kode allerede assignet til brukeren som forsøker å skrive den inn
//       return res.status(403).json({ status: 403, message: 'Kode er allerede lagt til i din saldo'})
//     } else { // kode eksisterer, kode allerede brukt av annen bruker
//       return res.status(403).json({ status: 403, message: 'Kode er allerede benyttet og er ikke gyldig lengre'})
//     }
//   } else { // kode eksisterer ikke
//     return res.status(403).json({ status: 403, message: 'Koden du tastet inne eksisterer ikke'})
//   }
// });

api.put('/editprofile', authenticate, async function (req, res) {
  const { id } = req.user;
  const {
    name,
    email,
  } = req.body;

  const updateUser = await editUserProfile({
    name,
    email,
    id
  });

  res.send(updateUser);
})

//Client routes

api.get(`/session`, authenticate,  (req, res) => {
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

    const match = bcrypt.compareSync(password, user.password);

    if(!match) {
      return res.status(401).json({ status: 401, message: 'Wrong password' })
    }

    const token = jwt.sign({ 
      id: user.id,
      name: user.name
    }, new Buffer(secret, 'base64'));

      res.send({
        token: token
      })
    
  } catch(error) {
    return res.status(401).json({status: 401, message: 'Oops something went wrong'})
  }
});



api.post(`/signup`, async (req, res) => {
  const { name, email, password } = req.body;
  const id = Math.floor(Math.random()*1000000000)
  // securing passwords
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const validateEmail = await emailValidation(email);

  
  if(+validateEmail.count) {
    return res.status(403).json({ status: 403, message: 'Email is already in use'})
  } else {
    const newUser = await createUser(name, email, hashPassword, id);
    res.send(newUser);
  } 
})

// PANTEMASKIN

//Functions

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

// updatePantData = async (session) => {
//   const { rows } = await pool.query(
//     `
//     UPDATE activities 
//     SET id=$1 WHERE code=$2
//     RETURNING *
//     `, [session.userId, session.userCode]
//   ) 

//   return rows[0]
// }

  //Routes
  
api.post('/pant', async (req, res) => {

  const {
    code,
    amount
  } = req.body;

  try {
    const newSession = await createPantData({
      code,
      amount,
    })

    res.send(newSession);
  } catch (err) {
    console.log(err.message);
  }
});




api.put('/pant', async (req, res) => {
  const {
    userCode,
    userId,
  } = req.body;

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