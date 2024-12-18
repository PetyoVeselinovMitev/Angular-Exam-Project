const express = require('express');
const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const Book = require('../models/booksModel');
const router = express.Router();

router.get('/check-auth', auth, (req, res) => {
    res.status(200).send(req.user)
})

router.post('/register-admin', auth, authAdmin, async (req, res) => {
    try {
        req.body.role = 'admin'
        const user = new Users(req.body);
        await user.save();
        res.status(200).send({ status: 'New admin account created.' })
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        req.body.role = 'user'
        const user = new Users(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id, username: user.username, role: user.role },
            'secret',
            { expiresIn: '1d', algorithm: 'HS256' });
        res.cookie('token', token)
        res.send({ user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token')
        res.send({ status: 'Logged out' })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json('Wrong email or password.');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json('Wrong email or password.');
        }

        const token = jwt.sign(
            { _id: user._id, username: user.username, role: user.role },
            'secret',
            { expiresIn: '1d', algorithm: 'HS256' }
        );
        res.cookie('token', token)
        res.send({ user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        res.status(404).send('No user id found');
        return;
    }
    const userData = await Users
        .findById(userId)
        .select('username email reservedBooks role')
        .exec();

    if (!userData) {
        res.status(404).send('User not found');
        return;
    }

    const booksData = []

    for (bookId of userData.reservedBooks) {
        const bookData = await Book
            .findById(bookId)
            .select('title imageUrl')
            .exec();

        booksData.push(bookData)
    }

    res.status(200).send({
        username: userData.username,
        email: userData.email,
        reservedBooks: userData.reservedBooks,
        role: userData.role,
        reservedBooksData: booksData,
        _id: userData._id
    })
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