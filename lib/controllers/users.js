const fileUtil = require('../fileUtil');
const routeHandler = {};
const helper = require('../helper');
const books = require('./books');

const users = {};
//read data for a single user:
users.getUser = (data,callback) => {
	if (data.query.name) {
        fileUtil.read('users', data.query.name, (err, data) => {
            if (!err && data) {
                callback(200, { message: 'user retrieved', data: data });
            } else {
                callback(404, { err: err, data: data, message: 'could not retrieve user' });
            }
        });
    } else {
        callback(404, { message: 'user not found', data: null });
    }
}
//Register a new user
users.registerUser = (data,callback) => {
	//validate that all required fields are filled out
    let name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    data.payload.books_borrowed = [];
    if(name){
        const fileName = data.payload.library_id = helper.generateRandomString(30);
        fileUtil.create('users', fileName, data.payload, (err) => {
            if (!err) {
                callback(200, { message: "user was registered successfully", data: null });
            } else {
                callback(400, { message: "could not register this user" });
            }
        });
    }else {
        //Alert user to complete missing fields
        callback(400, { message: "Please enter this user's name" });
    }
}
users.collectBook = (data,callback) => {
    return callback(200, {message : 'Book was lent out successfully'})
}
users.borrowBook = (data,callback) => {
	//validate that all required fields are filled out
	let library_id = data.query.library_id;
    library_id = typeof(library_id) === 'string' && library_id.trim().length > 0 ? library_id : false;
    if(!library_id) {
    	return callback(400, { message: "Please enter your library id and book id" });
    }
    //Check if user is registered
    fileUtil.is_existing('users',library_id, (err) => {
		if (err) return callback(400, { message: "Invalid User" });
		//Initiate the process of collecting book: 
    	books.lendBook(data,callback, () => {
    		fileUtil.read('users', data.query.library_id, (err, user) => {
    			if (err) return callback(404, {err, message: "could not access user" });
    			//Check if user already borrowed this book
    			if (user.books_borrowed.includes(data.query.library_id)) 
    				return callback(404, {message: 'This user already borrowed this book' });
    			//add book id to user's list of borrowed books and update user file:
    			user.books_borrowed.push(data.query.library_id);
				fileUtil.update('users', data.query.library_id,user,  (err) => {
		            if (err) return callback(404, {err, message: "could not update user with new book" });
    				return callback(404, {message: 'This user has successfully borrowed this book' });

		        });
	        });
    	});
	})
    
}
module.exports = users;
