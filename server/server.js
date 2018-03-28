// Express route handlers will be stored in server.js
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;
// Setting heroku - set port, then set the npm start script and npm node engine, then set mongoose mongodb URI

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

// GET /todos/1231432043
app.get('/todos/:id', (request, response) => {
    var id = request.params.id;
    // response.send(request.params);

    // Validate id using isValid
    // 404 - send back empty send
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
    // Todo.findById(id).then((todo) => {
    //     if (!todo) {
    //         return response.status(404).send();
    //     }
    //     response.send(todo);
    // }, (error) => {
    //     response.status(400).send();
    // });

    // findById
        // success
            // if todo - send it back
            // if no todo - send back 404 with empty body
        // error
            // 400 - and send back an empty body
});

app.delete('/todos/:id', (request, response) => {
    // get the id
    var id = request.params.id;

    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    // remove todo by id
        // success
            // if no doc, send 404 because mongoose will return a success case even if id is not found...
            // if doc, send doc back with 200
        // error
            // 404 with empty body
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send(error.message);
    });
});

app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']); // properties text and completed can only be edited by user

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // new: true === returnOriginal: false
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({todo});
    }).catch((error) => response.status(400).send());
});

app.post('/users', (request, response) => {
    // var user = new User({
    //     email: request.body.email
    // });
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);

    // Model methods - User
    // instance methods - user

    user.save().then(() => {
        return user.generateAuthToken();
        // response.send(document);
    }).then((token) => {
        // custom header to store that jwt
        response.header(`x-auth`, token).send(user);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

// app.get('/users/me', authenticate, (request, response) => {
//     var token = request.header('x-auth');
//
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             return Promise.reject();
//         }
//
//         response.send(user);
//     }).catch((error) => {
//         // catch the rejected Promise when then() does not fire
//         response.status(401).send();
//     });
// });


app.listen(port, () => {
    console.log(`Started on port ${port}`);
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