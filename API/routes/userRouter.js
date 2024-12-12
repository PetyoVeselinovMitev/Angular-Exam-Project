const express = require('express');
const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const router = express.Router();

router.post('/register-admin', auth, authAdmin, async (req, res) => {
    try {
        req.body.role = 'admin'
        const user = new Users(req.body);
        await user.save();
        res.status(200).send('New admin account created.')
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        req.body.role = 'user'
        const user = new Users(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
        res.cookie('token', token)
        res.send({ user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const dummyPayload = req.body.shit
        res.clearCookie('token')
        res.send({ dummyPayload })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

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

        const token = jwt.sign(
            { _id: user._id, username: user.username, role: user.role },
            'your_jwt_secret',
            { expiresIn: '1d' }
        );
        res.cookie('token', token)
        res.send({ user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = req.user;

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;