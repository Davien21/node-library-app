const fileUtil = require('../fileUtil');
const routeHandler = {};
const helper = require('../helper');

const books = {};
books.addNewBook = (data,callback) => {
	//validate that all required fields are filled out
    var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    var price = typeof(data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    var author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    var quantity = typeof(data.payload.quantity) === 'string' && data.payload.quantity.trim().length > 0 ? data.payload.quantity : false;
    if(name && price && author && publisher && quantity){
        const fileName = helper.generateRandomString(30);
        fileUtil.create('books', fileName, data.payload, (err) => {
            if (!err) {
                callback(200, { message: "book added successfully", data: null });
            } else {
                callback(400, { message: "could add book" });
            }
        });
    }else {
        //Alert user to complete missing fields
        callback(400, { 
            message: "Please fill in all required details : name, price, author, publisher and quantity of this book" 
        });
    }
}
books.getBook = (data,callback) => {
	if (data.query.name) {
        fileUtil.read('books', data.query.name, (err, data) => {
            if (!err && data) {
                callback(200, { message: 'book retrieved', data: data });
            } else {
                callback(404, { err: err, data: data, message: 'could not retrieve book' });
            }
        });
    } else {
        callback(404, { message: 'book not found', data: null });
    }
}

module.exports = books;