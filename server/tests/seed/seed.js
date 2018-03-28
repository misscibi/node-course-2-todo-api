const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userLinkId = new ObjectID();
const userSidonId = new ObjectID();
const users = [{
    _id: userLinkId,
    email: 'link@hyrule.com',
    password: 'ilovesidon',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userLinkId, access: 'auth'}, 'link').toString()
    }]
}, {
    _id: userSidonId,
    email: 'sidon@zora.com',
    password: 'ilovelink'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        // return Todo.insertMany(todos, (error) => {
        //     if (error) {
        //         return done(error);
        //     }
        // });
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        // wait for all the save actions to complete
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};