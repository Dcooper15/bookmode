const db = require("../models");
const Book = db.books;
const Author = db.authors;
const Shelf = db.shelves;
const User = db.users;

const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    const {title, imageURL } = req.body;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Book.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving books."
            });
        });
    };
exports.create = async (req, res) => {
    //Validate request
    console.log('this is what is getting sent in as the req.body: ', req.body)
    //save book in DB
    const {title, coverURL, authorName } = req.body;
    const book = await Book.create({
        title: title,
        coverURL: coverURL,})
    const author = await Author.create({
            authorName: authorName
        })
    await author.addBook(book)
    const shelf= await Shelf.findByPk(1)
    await shelf.addBook(book)
    .then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the book."
            });
        })
    }
exports.findOne = (req, res) => {
    const id = req.params.id;
    Book.findByPk(id)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: "Error retrieving Book with id=" + id
        });
        });
    };
exports.update = (req, res) => {
    const id = req.params.id;
    Book.update(req.body, {
        where: { id: id }
    })
        .then(num => {
        if (num == 1) {
            res.send({
            message: "Book was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Bookwith id=${id}. Maybe the Book was not found or req.body is empty!`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating Book with id=" + id
        });
        });
    };
exports.delete = (req, res) => {
    const id = req.params.id;
    
    Book.destroy({
        where: { id: id }
    })
        .then(num => {
        if (num == 1) {
            res.send({
            message: "Book was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Could not delete book with id=" + id
        });
        });
    };