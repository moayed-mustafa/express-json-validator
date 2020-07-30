
const request = require('supertest')
const Book = require('../models/book')
const app = require('../app')



process.env.NODE_ENV === 'test'


const db = require("../db");

/**
 * What I want to test
 * getting all books
 * getting a specific book
 * createing a book
 * updating a book
 * deleting a book
 */
let testBook

    beforeEach(async () => {
        // create a book
       const bookData =  {
            "isbn": "0691161518",
            "amazon-url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking Hidden Math in Video Games",
            "year": 2017
       }
         testBook = await Book.create(bookData)


    })


    afterEach(async () => {
        await db.query('DELETE FROM books')

    })

afterAll(async () => {
    await db.end()
    })

describe('/GET/BOOK', () => {
    test('test getting all books', async () => {
        const res = await request(app).get('/books')
        expect(res.statusCode).toEqual(200)
        expect(res.body.books[0].isbn).toEqual(testBook.isbn)
    })


})
describe('/GET/BOOKS/ID', () => {

    test('test getting one book, success', async () => {
        const id = testBook.isbn

        const res = await request(app).get(`/books/${id}/`)
        // console.log(res)
        expect(res.statusCode).toEqual(200)
        expect(res.body.book).toEqual(testBook)
        })
    test('test getting one book, failure', async () => {
        const id = '75393975'

        const res = await request(app).get(`/books/${id}/`)
        // console.log(res)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual(expect.stringContaining(`${id}`))
        })

})


