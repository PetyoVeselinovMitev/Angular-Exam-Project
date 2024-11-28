const express = require('express');
const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret', {expiresIn: '1d'});
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('Unable to login');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send('Unable to login');
        }

        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret' , {expiresIn: '1d'});
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
