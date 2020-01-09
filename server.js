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

// amountQuery = async (code) => {
//   const { rows } = await pool.query(`
//     SELECT
//       amount
//     FROM
//       activities
//     WHERE
//       code = $1
//   `, [code])

//   return rows[0];
// }

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

// codeValidation = async (code) => {
//   const { rows } = await pool.query(`
//     SELECT
//       COUNT(code)
//     FROM
//       activities
//     WHERE
//       code = $1
//   `, [code])

//   return rows[0];
// }

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
      activities
  `)

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

api.post('/home', authenticate, async (req, res) => {
  const { id } = req.user;
  const {userCode} = req.body;
  console.log(userCode)

  if(!userCode) {
    res.send(404).json({status: 404, message: 'No code found - please insert a code'})
  } else {
    const claimedCode = claimCode(userCode, id);
    res.send(claimedCode) 
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

api.put('/profile', function (req, res) {
  const userId = req.user.id;
  console.log(userId)
  const {
    name,
    email,
    phone
  } = req.body;

  const updateUser = editUserProfile({
    name,
    email,
    phone,
    userId
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
  const { name, email, phone, password } = req.body;
  // securing passwords
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const validateEmail = await emailValidation(email);
  const validatePhone = await phoneValidation(phone);

  if(+validateEmail.count && +validatePhone.count){
    return res.status(403).json({ status: 403, message: 'Email and phonenumber is already in use'})
  }else if(+validateEmail.count) {
    return res.status(403).json({ status: 403, message: 'Email is already in use'})
  } else {
    const newUser = await createUser(name, email, phone, hashPassword);
    res.send(newUser);
  } 
})

// PANTEMASKIN

//Functions

editUserProfile = async (userData) => {
  const { rows } = await pool.query(
    `
      UPDATE users(
          name,
          email,
          phone
      )
  
      VALUES(
          $1,
          $2,
          $3
      )
      WHERE
        id = $4
      RETURNING * 
      `, [userData.name, userData.email, userData.phone]);
  
      return rows[0]
}

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