// Express route handlers will be stored in server.js

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// the bodyParser.json() return value is a function that will be used as middleware
app.use(bodyParser.json());

// Client will send a JSON object
// Server will return a model
app.post('/todos', (request, result) => {
    // body gets stored by body-parser module
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text,
        completed: request.body.completed,
        completedAt: request.body.completedAt
    });

    todo.save().then((document) => {
        result.send(document);
    }, (error) => {
        result.status(400).send(error);
    });
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos});
    }, (error) => {
        response.status(400).send(error);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};

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


// var user = new User({
//     email: 'link@hyrule.com'
// });
//
// user.save().then((doc) => {
//     console.log('User saved', doc);
// }, (e) => {
//     console.log('Unable to save user', e);
// });