const express = require("express");
const Book = require("../models/book");
const jsonSchema = require('jsonschema')

const router = new express.Router();
const createBookSchema = require('../schemas/createBookSchema.json');
const updateBookSchema = require('../schemas/updateBookSchema.json');
const ExpressError = require("../../express-api-validation/expressError");


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const isValid = jsonSchema.validate(req.body, createBookSchema)
    if ( ! isValid.valid) {
      let listOfErrors = isValid.errors.map(er => er.stack)
      throw new ExpressError(listOfErrors, 404)
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const isValid = jsonSchema.validate(req.body, updateBookSchema)

    if (!isValid.valid) {
      let errorList = isValid.errors.map(er => er.stack)
      throw new ExpressError(errorList, 404)
    }
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book: book});
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


