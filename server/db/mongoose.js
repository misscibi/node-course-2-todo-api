var mongoose = require('mongoose');


// use the native Javascript Promise instead of Mongoose/third-party one
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
// mongoose waits for a connection first before it executes the queries
// mongoose does typecasting

module.exports = {mongoose};

// process.env.NODE_ENV === 'production' -- by default
// process.env.NODE_ENV === 'development' -- when we run the app locally
// process.env.NODE_ENV === 'test' -- for testing locally

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// var newTodo = new Todo({
//     text: 'Noctis to fish bass for dinner',
//     completed: true,
//     completedAt: 35
// });
//
// // Saving to MongoDB database
// newTodo.save().then((document) => {
//     console.log('Saved todo', document);
// }, (e) => {
//     console.log('Unable to save todo')
// });


// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     }
// });
//
// var user = new User({
//     email: 'link@hyrule.com'
// });
//
// user.save().then((doc) => {
//     console.log('User saved', doc);
// }, (e) => {
//     console.log('Unable to save user', e);
// });