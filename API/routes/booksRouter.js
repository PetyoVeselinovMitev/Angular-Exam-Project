const express = require('express');
const Book = require('../models/booksModel');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/books', auth, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/books', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const books = await Book.find({})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Book.countDocuments();

        res.send({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }
        res.send(book);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.patch('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }
        res.send(book);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }
        res.send({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
