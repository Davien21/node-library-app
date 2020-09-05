const books = require('./controllers/books');
const users = require('./controllers/users');

//Set up routes along with their handlers in the routes object
const routes = {
    "get" : {
        "book" : books.getBook,
        "user" : users.getUser,
    },
    "post" : {
        "book" : books.addNewBook,
        "user" : users.registerUser,
    },
    "put" : {
        "book" : books.updateBook,
        "user/borrow" : users.borrowBook,
        "user/return" : users.returnBook,
    },
    "delete" : {
        "book" : books.removeBook
    }
};

//Handle routing using the routes object:
let router = (data,callback) => {
    if (!routes[data.method]) return callback(404,{ message: 'This HTTP Method is not allowed!'});
    if (!routes[data.method][data.trimedPath]) return callback(404,{ message: 'Page not found!'});
    return routes[data.method][data.trimedPath](data,callback);
}
//Export the router or route handler below:
module.exports = router;