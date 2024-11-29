const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: {type: String, required: true},
    ISBN: { type: String, required: true, unique: true },
    publicationDate: { type: String, required: true },
    genre: { type: String, required: true },
    summary: { type: String },
    language: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    publisher: { type: String, required: true },
    availableCopies: { type: Number, default: 1 }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
