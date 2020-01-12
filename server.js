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
const { authenticate } = require('./middlewares/middleware')
const { cryptPassword, decryptPassword } = require('./middlewares/bcrypt')
const { 
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
 } = require('./middlewares/functions')

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

api.get('/name', authenticate, async (req, res) => {
  const { id } = req.user;
  const userName = await getNameById(id);
  res.send(userName)
})

api.post('/home', authenticate, async (req, res) => {
  const { id } = req.user;

  const {userCode} = req.body;
  const checkCode = await codeValidation( userCode )
  const amountInCode = await amountQuery ( userCode )
  
  if(parseInt(checkCode.count) === 0) {
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
    password,
    newPassword
  } = req.body;

  const user = await getUserByEmail(email)
  const match = await decryptPassword(password, user.password);

  if (!match) {
    return res.status(401).json({status: 401, message: 'Feil passord'})
  } else {
    const hashPassword = await cryptPassword(newPassword)
    if(newPassword) {
      const updateUser = await editUserProfile({
        name,
        email,
        id,
        hashPassword,
      });
      res.send(updateUser);
    } else {
      const hashPassword = user.password
      const updateUser = await editUserProfile({
        name,
        email,
        id,
        hashPassword,
      });
      res.send(updateUser);
    }
    
  }
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

    const match = await decryptPassword(password, user.password);

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

  const validateEmail = await emailValidation(email);
  const hashPassword = await cryptPassword(password);
  
  if(+validateEmail.count) {
    return res.status(403).json({ status: 403, message: 'Email is already in use'})
  } else {
    const newUser = await createUser(name, email, hashPassword, id);
    res.send(newUser);
  } 
});

// PANTEMASKIN

//Functions



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