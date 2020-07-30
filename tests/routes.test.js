
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
            "amazon_url": "http://a.co/eobPtX2",
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


describe('/POST/BOOKS/', () => {

    test('test creating a book, success', async () => {
        const bookData =  {
            "isbn": "4444444444",
            "amazon_url": "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
            "author": "J K Rowling",
            "language": "english",
            "pages": 359,
            "publisher": "Penguin",
            "title": "Harry Potter and the half blood prince",
            "year": 2005
       }

        const res = await request(app).post(`/books`).send(bookData)
        expect(res.statusCode).toEqual(201)
        // expect(res.body.book).toEqual(testBook)
        })
    test('test getting one book, validation failure', async () => {
        // adding a isbn that is less than 10
        const bookData =  {
            "isbn": "44",
            "amazon_url": "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
            "author": "J K Rowling",
            "language": "english",
            "pages": 359,
            "publisher": "Penguin",
            "title": "Harry Potter and the half blood prince",
            "year": 2005
       }

        expect( async () => {
            const res = await request(app).post(`/books`).send(bookData).toThrow()
        })

        })

})


describe('/PUT/BOOKS/ISBN', () => {

    test('updating a book,  success', async () => {
        const bookData =  {
            "amazon_url": "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
            "author": "J K Rowling",
            "language": "english",
            "pages": 359,
            "publisher": "Penguin",
            "title": "Harry Potter and the half blood prince",
            "year": 2005
       }

        const res = await request(app).put(`/books/${testBook.isbn}`).send(bookData)
        expect(res.statusCode).toEqual(200)
        expect(res.body.book.title).toEqual(bookData.title)
    })


    test('test updating book, validation, failure', async () => {
        // adding a year above the maximum
        const bookData =  {

            "amazon_url": "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
            "author": "J K Rowling",
            "language": "english",
            "pages": 359,
            "publisher": "Penguin",
            "title": "Harry Potter and the half blood prince",
            "year": 2022
       }

        expect( async () => {
            const res = await request(app).put(`/books/${testBook.isbn}`).send(bookData).toThrow()
        })

        })

})

describe('/DELETE/BOOK', () => {

    test('test deleting a book', async () => {
        const res = await request(app).delete(`/books/${testBook.isbn}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Book deleted")
    })


})


