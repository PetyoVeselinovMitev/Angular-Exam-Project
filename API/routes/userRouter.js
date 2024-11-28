const express = require('express');
const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret', {expiresIn: '15s'});
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Login a user
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

        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret' , {expiresIn: '15s'});
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Protected route example
router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
