const fileUtil = require('../fileUtil');
const helper = require('../helper');
const books = {};
//Create a new book object and writce to a file:
books.addNewBook = (data,callback) => {
	//validate that all required fields are filled out
    let name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    let price = typeof(data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    let author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    let publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    let quantity = typeof(data.payload.quantity) === 'string' && data.payload.quantity.trim().length > 0 ? data.payload.quantity : false;
    if(name && price && author && publisher && quantity) {
        const fileName = helper.generateRandomString(30);
        fileUtil.create('books', fileName, data.payload, (err) => {
            if (!err) {
                callback(200, { message: "book added successfully", data: null });
            } else {
                callback(400, { message: "could not add this book" });
            }
        });
    }else {
        //Alert user to complete missing fields
        callback(400, { 
            message: "Please fill in all required details : name, price, author, publisher and quantity of this book" 
        });
    }
}
//Read the content of a book:
books.getBook = (data,callback) => {
	if (data.query.name) {
        fileUtil.read('books', data.query.name, (err, data) => {
            if (!err && data) {
                callback(200, { message: 'book retrieved', data: data });
            } else {
                callback(404, { err: err, data: data, message: 'could not retrieve this book' });
            }
        });
    } else {
        callback(404, { message: 'Please enter the book id', data: null });
    }
}
//Update the information of a book:
books.updateBook = (data,callback) => {
	if (data.query.name) {
        fileUtil.update('books', data.query.name,data.payload,  (err) => {
            if (!err) {
                callback(200, {message : 'book updated successfully'})
            }else{
                callback(400, {err : err, data : null, message : 'could not update book'});
            }
        });
    } else {
        callback(404, { message: 'book not found' });
    }
}
//Remove book from library register:
books.removeBook = (data,callback) => {
	if(data.query.name){
        fileUtil.delete('books', data.query.name, (err) => {
            if(!err){   
                callback(200, {message : 'book deleted successfully'});
            }else{
                callback(400, {err : err, message : 'could not delete book'});
            }
        })
    }else{
        callback(404, {message : 'book not found'});
    }
}
books.reduceBookQuantity = (book_object) => {
	book_object.quantity--;
}
books.addBookQuantity = (book_object) => {
    book_object.quantity++;
}
books.lendBook = (data,callback,giveBookToUser) => {
	let name = data.query.name;
	if (name) {
		fileUtil.read('books', data.query.name, (err, book) => {
			if (err) return callback(404, { message: "could not find this book" });
			//Check if book count is zero and alert user
			if (book.quantity == 0) return callback(404, { message: "This book is currently unavailable for rent" });
			//Reduce number of available books {--err, fix update only after user takes book}
			book.quantity--;
			fileUtil.update('books', data.query.name, book,  (err) => {
	            if (err) return callback(404, {err, message: "could not update library" });
	            giveBookToUser(data,callback);
	        });
        });

    } else {
        callback(400, { message: 'Please enter a correct book id', data: null });
    }
   
}
books.retrieveBook = (data,callback,collectFromUser) => {
	let name = data.query.name;
	if (name) {
		fileUtil.read('books', data.query.name, (err, book) => {
			if (err) return callback(404, { message: "could not find this book" });
			//Increase number of available books
			book.quantity++;
			fileUtil.update('books', data.query.name,book,  (err) => {
	            if (err) return callback(404, {err, message: "could not update library" });
	            collectFromUser(data,callback);
	        });
        });

    } else {
        callback(400, { message: 'Please enter a correct book id', data: null });
    }
   
}
module.exports = books;