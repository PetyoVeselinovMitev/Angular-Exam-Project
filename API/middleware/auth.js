const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) throw new Error('No token found')
            
        const decoded = jwt.verify(token, 'secret', { algorithms: ['HS256']}); 
        const user = await Users.findOne({ _id: decoded._id });

        if (!user) throw new Error('No user');

        req.user = user;
    } catch (error) {
        res.clearCookie('token')
        res.status(401).send({ error: 'Please authenticate.' });
    }
    next();
};

module.exports = auth;
