const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,"./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(":", "_").replace(":", "_") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits:{ 
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

const Book = require("../models/book");

router.get("/", checkAuth, (req, res, next)=> {
    Book.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post("/", checkAuth, upload.single("bookImage"),  (req, res, next)=> {
    console.log(req.file);
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        print: req.body.print,
        author: req.body.author,
        type: req.body.type,
        language: req.body.language,
        yearOfBookProduction: req.body.yearOfBookProduction,
        price: req.body.price,
        bookImage: req.file.path
    });
    book.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nową książkę",
            createdBook: book
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get("/:bookId", (req, res, next)=> {
    const id = req.params.bookId;
    Book.findById(id).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));
  
});

router.patch("/:bookId", (req, res, next)=> {
    const id = req.params.bookId;
    Book.update({_id:id}, { $set: {
        title: req.body.title,
        print: req.body.print,
        author: req.body.author,
        type: req.body.type,
        language: req.body.language,
        yearOfBookProduction: req.body.yearOfBookProduction,
        price: req.body.price
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana książki o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
  
});

router.delete("/:bookId", (req, res, next)=> {
    const id = req.params.bookId;
    Book.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie książki o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;