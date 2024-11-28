const express = require('express');
const Users = require('../models/userModel');
const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await Users.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
