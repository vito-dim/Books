const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const exp = require('constants');
const expect = chai.expect;

chai.use(chaiHttp);

// Set a test Suite from Mocha framework
describe('Books API', () => {
    let bookId;

    // Define first test case
    it('should POST a book', (done) => {
        const book = {id: "1", title: "DevOps Master", author: "Vidrax"};
        chai
            .request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();
            });
    });
    it('should GET all books', (done) => {
        chai
            .request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });
    // Verify Getting a Single Books
    it('should GET book with id=1', (done) => {
        const bookId = "1";
        chai
            .request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });
    // Verify Updating a Book
    it('should PUT (upadete) book with id=1', (done) => {
        const bookId = "1";
        const modifiedTitle = "Master of disaster",
              modifiedAuthor = "me",
              updatedBook = { id: bookId, title: modifiedTitle, author: modifiedAuthor };
        chai
            .request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.be.equal(modifiedTitle);
                expect(res.body.author).to.be.equal(modifiedAuthor);
                done();
            });

    });
    // Verify Deleting a Book
    it('should DEL book with id=1', (done) => {
        const bookId = "1";

        chai
            .request(server)
            .del(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });

    // Verify Non-Existing Book
    it('should return 404 when trying to GET, PUT or DELETE a non-existing book', (done) => {
        const nonExistingBook = "9999",
              nonExistingBookDetails = { id: nonExistingBook, title: "There is no such thing", author: "Unknown" };
        chai
            .request(server)
            .get(`/books/${nonExistingBook}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
            });
        
        chai
            .request(server)
            .put(`/books/${nonExistingBook}`)
            .send(nonExistingBookDetails)
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai
            .request(server)
            .delete(`/books/${nonExistingBook}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
})