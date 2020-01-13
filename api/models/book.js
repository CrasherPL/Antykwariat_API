const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    print: String,
    author: String,
    type: String,
    language: String,
    price: Number,
    yearOfBookProduction: Number,
    bookImage: String
});

module.exports = mongoose.model("book", bookSchema);