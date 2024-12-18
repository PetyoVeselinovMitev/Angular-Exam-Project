const express = require('express');
const Book = require('../models/booksModel');
const Users = require('../models/userModel')
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const router = express.Router();

router.get('/books-recent', async (req, res) => {
    try {
        const recentBooks = await Book.find().sort({ $natural: -1 }).limit(3).select('title author imageUrl');
        res.send(recentBooks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/books-short', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5
        const skip = (page - 1) * limit

        const books = await Book.find({})
            .sort({$natural: -1})
            .limit(limit)
            .skip(skip)
            .select('title summary genre imageUrl')
            .exec();

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit)

        res.send({
            books,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        if (!books) {
            return res.status(404).send({ error: 'Books not found' });
        }
        res.send(books);
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

router.post('/books', auth, authAdmin, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        if (error.code = 11000) {
            res.status(400).send({ error: 'A book with this ISBN already exists'})
        } else {
            res.status(400).send({ error: error.message });
        }
    }
});

router.patch('/books/:id', auth, authAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }
        res.send(book);
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({ error: 'A book with this ISBN already exists'})
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

router.delete('/books/:id', auth, authAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        await Users.updateMany(
            { reservedBooks: book._id },
            { $pull: { reservedBooks: book._id } }
        )
        res.send({ message: 'Book deleted successfully and removed from users\' reserved books' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/books/:id/reserve', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({ error: 'No available copies' });
        }

        const user = req.user;

        if (user.reservedBooks.length >= 5) {
            return res.status(400).json({ error: 'You can\'t reserve more than 5 books' });
        }

        if (user.reservedBooks.includes(book._id)) {
            return res.status(400).json({ error: 'Book already reserved' });
        }

        user.reservedBooks.push(book._id);
        book.availableCopies -= 1;

        await user.save();
        await book.save();

        res.json({ message: 'Book reserved successfully', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/books/:id/return', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        const user = req.user;

        if (!user.reservedBooks || !user.reservedBooks.includes(book._id)) {
            return res.status(400).send({ error: 'Book not reserved by the user' });
        }

        user.reservedBooks = user.reservedBooks.filter(
            reservedBook => !reservedBook.equals(book._id)
        );
        book.availableCopies += 1;

        await user.save();
        await book.save();

        res.send({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;