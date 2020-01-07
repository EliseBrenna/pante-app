const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

authenticate = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    try{
        const { id } = jwt.verify(token, new Buffer(secret, 'base64'));
        req.user = { id };
        next();
    } catch(error) {
        res.status(401).send({ error: 'Unable to authenticate - please use a valid token' })
    }
};

module.exports = {
    authenticate
};